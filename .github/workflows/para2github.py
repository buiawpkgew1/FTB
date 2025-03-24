"""ParaTranz到GitHub的翻译同步脚本

此脚本用于从ParaTranz平台下载翻译内容并同步到GitHub仓库。
主要功能包括：
- 从ParaTranz获取翻译文件
- 处理翻译内容并保存为JSON格式
- 特殊处理FTB Quest的翻译文件
- 生成SNBT格式的翻译文件

环境变量要求：
- API_TOKEN: ParaTranz API密钥
- GH_TOKEN: GitHub访问令牌
- PROJECT_ID: ParaTranz项目ID
"""

import json
import os
import re
from pathlib import Path
from typing import Tuple, Dict, Any, List
import nbtlib
from nbtlib.tag import Compound, String, Int
import requests
from requests.exceptions import RequestException

# 环境变量配置
TOKEN: str = os.getenv("API_TOKEN", "")
GH_TOKEN: str = os.getenv("GH_TOKEN", "")
PROJECT_ID: str = os.getenv("PROJECT_ID", "")
FILE_URL: str = f"https://paratranz.cn/api/projects/{PROJECT_ID}/files/"

if not TOKEN or not PROJECT_ID:
    raise EnvironmentError("环境变量 API_TOKEN 或 PROJECT_ID 未设置。")

# 初始化列表和字典
file_id_list: list[int] = []
file_path_list: list[str] = []
zh_cn_list: list[dict[str, str]] = []


def fetch_json(url: str, headers: dict[str, str]) -> List[Dict[str, Any]]:
    """从指定URL获取JSON数据
    
    Args:
        url: API端点URL
        headers: 请求头部信息
        
    Returns:
        解析后的JSON数据
        
    Raises:
        RequestException: 当API请求失败时
    """
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except RequestException as e:
        print(f"API请求失败: {e}")
        raise


def translate(file_id: int) -> Tuple[List[str], List[str]]:
    """获取指定文件的翻译内容并返回键值对列表
    
    Args:
        file_id: ParaTranz文件ID
        
    Returns:
        包含键和值的元组列表，分别为(keys, values)
        
    Raises:
        RequestException: 当API请求失败时
    """
    url = f"https://paratranz.cn/api/projects/{PROJECT_ID}/files/{file_id}/translation"
    headers = {"Authorization": TOKEN, "accept": "*/*"}
    translations = fetch_json(url, headers)

    keys: List[str] = []
    values: List[str] = []

    for item in translations:
        keys.append(item["key"])
        translation = item.get("translation", "")
        original = item.get("original", "")
        # 优先使用翻译内容，缺失时根据stage使用原文
        # stage为0或-1表示未翻译或需要重新翻译
        values.append(
            original if not translation and item["stage"] in [0, -1] else translation
        )

    return keys, values


def get_files() -> None:
    """获取项目中的文件列表并提取文件ID和路径
    
    从ParaTranz API获取项目文件列表，并将文件ID和路径保存到全局列表中
    
    Raises:
        RequestException: 当API请求失败时
    """
    headers = {"Authorization": TOKEN, "accept": "*/*"}
    try:
        files = fetch_json(FILE_URL, headers)
        for file in files:
            file_id_list.append(file["id"])
            file_path_list.append(file["name"])
    except RequestException as e:
        print(f"获取文件列表失败: {e}")
        raise


def save_translation(zh_cn_dict: Dict[str, str], path: Path) -> None:
    """保存翻译内容到指定的JSON文件
    
    Args:
        zh_cn_dict: 翻译内容的字典
        path: 原始文件路径
        
    Raises:
        IOError: 当文件读写操作失败时
        json.JSONDecodeError: 当JSON解析失败时
    """
    try:
        # 创建目标目录
        dir_path = Path("CNPack") / path.parent
        dir_path.mkdir(parents=True, exist_ok=True)
        
        # 设置文件路径
        file_path = dir_path / "zh_cn.json"
        source_path = str(file_path).replace("zh_cn.json", "en_us.json").replace("CNPack", "Source")
        
        # 写入翻译内容
        with open(file_path, "w", encoding="UTF-8") as f:
            try:
                # 尝试读取源文件并合并翻译
                with open(source_path, "r", encoding="UTF-8") as f1:
                    source_json: Dict[str, str] = json.load(f1)
                for key in source_json:
                    if key in zh_cn_dict:
                        source_json[key] = zh_cn_dict[key]
                json.dump(source_json, f, ensure_ascii=False, indent=4, separators=(",", ":"))
                print(f"成功保存翻译到: {file_path}")
            except (IOError, json.JSONDecodeError) as e:
                print(f"源文件处理失败: {e}，使用新的翻译内容")
                json.dump(zh_cn_dict, f, ensure_ascii=False, indent=4, separators=(",", ":"), sort_keys=True)
    except Exception as e:
        print(f"保存翻译失败: {e}")
        raise


def process_translation(file_id: int, path: Path) -> Dict[str, str]:
    """处理单个文件的翻译，返回翻译字典
    
    Args:
        file_id: ParaTranz文件ID
        path: 文件路径
        
    Returns:
        翻译内容字典，键为原文，值为译文
        
    Raises:
        RequestException: 当API请求失败时
        ValueError: 当文本处理失败时
    """
    try:
        keys, values = translate(file_id)
        
        # 手动处理文本的替换，避免反斜杠被转义
        zh_cn_dict: Dict[str, str] = {}
        for key, value in zip(keys, values):
            try:
                # 确保替换特殊字符
                value = re.sub(r"&#92;", r"\\", value)
                value = re.sub(r"\\u00A0", "\u00A0", value)  # 替换不间断空格
                value = re.sub(r"\\n", "\n", value)  # 替换换行符
                zh_cn_dict[key] = value
            except re.error as e:
                print(f"文本替换失败: {e}, key={key}, value={value}")
                zh_cn_dict[key] = value  # 使用原始值

        # 特殊处理：ftbquest文件中的空格
        if "ftbquest" in path.name:
            zh_cn_dict = {
                key: value.replace(" ", "\u00A0") if "image" not in value else value
                for key, value in zh_cn_dict.items()
            }

        return zh_cn_dict
    except Exception as e:
        print(f"处理翻译失败: {e}")
        raise


def json_to_nbt(data: Any) -> Union[Compound, nbtlib.tag.List, String, Int]:
    """将JSON数据转换为NBT复合结构
    
    Args:
        data: 要转换的JSON数据
        
    Returns:
        转换后的NBT数据结构
        
    Raises:
        ValueError: 当遇到不支持的数据类型时
    """
    try:
        if isinstance(data, dict):
            return Compound({key: json_to_nbt(value) for key, value in data.items()})
        elif isinstance(data, list):
            return nbtlib.tag.List[nbtlib.tag.String]([json_to_nbt(item) for item in data])
        elif isinstance(data, str):
            return String(data)
        elif isinstance(data, int):
            return Int(data)
        else:
            raise ValueError(f"不支持的数据类型: {type(data)}")
    except Exception as e:
        print(f"NBT转换失败: {e}, data={data}")
        raise

def format_snbt(nbt_data: Union[Compound, nbtlib.tag.List, String, Int], indent: int = 0) -> str:
    """格式化SNBT数据，添加缩进并用双引号包裹所有值
    
    Args:
        nbt_data: 要格式化的NBT数据
        indent: 当前缩进级别
        
    Returns:
        格式化后的SNBT字符串
        
    Raises:
        ValueError: 当遇到不支持的NBT数据类型时
    """
    try:
        INDENT_SIZE = 4  # 每级缩进的空格数
        indent_str = ' ' * indent
        
        if isinstance(nbt_data, Compound):
            formatted = ['{']
            for key, value in nbt_data.items():
                formatted.append(
                    f'\n{indent_str}{" " * INDENT_SIZE}{key}:'
                    f'{format_snbt(value, indent + INDENT_SIZE)}'
                )
            formatted.append(f'\n{indent_str}}}')
            return ''.join(formatted)
        
        elif isinstance(nbt_data, nbtlib.tag.List):
            formatted = ['[']
            for item in nbt_data:
                formatted.append(
                    f'\n{indent_str}{" " * INDENT_SIZE}'
                    f'{format_snbt(item, indent + INDENT_SIZE)}'
                )
            formatted.append(f'\n{indent_str}]')
            return ''.join(formatted)
        
        elif isinstance(nbt_data, (String, Int)):
            return f'"{str(nbt_data)}"'
        
        else:
            raise ValueError(f"不支持的NBT数据类型: {type(nbt_data)}")
    except Exception as e:
        print(f"SNBT格式化失败: {e}, data={nbt_data}")
        raise
def escape_quotes(data):
    if isinstance(data, dict):
        return {key: escape_quotes(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [escape_quotes(item) for item in data]
    elif isinstance(data, str):
        return data.replace('"', '\\"')
    else:
        return data

def  normal_json2_ftb_desc(origin_en_us):
    en_json = json.dumps(origin_en_us,ensure_ascii=False, indent=4, separators=(",", ":"),sort_keys=True)
    en_json = eval(en_json)
    temp_set = set()
    temp_en_json = {}
    for key, value in list(en_json.items()):
        if "desc" in key:
            key_id = key.split(".")[1]
            temp_json_array = []
            for k in en_json.keys():
                if f"{key_id}.quest_desc" in k:
                    temp_json_array.append(en_json[k])
            new_key = f"quest.{key_id}.quest_desc"
            temp_en_json[new_key] = temp_json_array
            temp_set.add(key)
    for key in temp_set:
        en_json.pop(key, None)
    en_json.update(temp_en_json)

    print("NormalJson2FtbDesc end...")
    return en_json

def main() -> None:
    get_files()
    ftbquests_dict = {}
    for file_id, path in zip(file_id_list, file_path_list):
        if "TM" in path:  # 跳过 TM 文件
            continue
        zh_cn_dict = process_translation(file_id, Path(path))
        zh_cn_list.append(zh_cn_dict)
        if "kubejs/assets/quests/lang/" in path:
            ftbquests_dict = ftbquests_dict | zh_cn_dict
            continue;
        save_translation(zh_cn_dict, Path(path))
        print(f"已从Patatranz下载到仓库：{re.sub('en_us.json', 'zh_cn.json', path)}")
    snbt_dict = normal_json2_ftb_desc(ftbquests_dict)
    
    #json_data = json.dumps(snbt_dict,ensure_ascii=False, indent=4, separators=(",", ":"))
    # Escape quotation marks in the translated data
    json_data = escape_quotes(snbt_dict)

    # Convert the loaded JSON data to NBT format
    nbt_data = json_to_nbt(json_data)

    # Format the NBT structure as a pretty-printed SNBT string
    formatted_snbt_string = format_snbt(nbt_data)
    # Optionally save the formatted SNBT to a file
    with open('CNPack/config/ftbquests/quests/lang/zh_cn.snbt', 'w', encoding='utf-8') as snbt_file:
        snbt_file.write(formatted_snbt_string)
    
if __name__ == "__main__":
    main()
