import asyncio
import os
import json
from pprint import pprint
import paratranz_client
from pydantic import ValidationError

configuration = paratranz_client.Configuration(host="https://paratranz.cn/api")
configuration.api_key["Token"] = os.environ["API_TOKEN"]


async def upload_file(path, file):
    async with paratranz_client.ApiClient(configuration) as api_client:
        api_instance = paratranz_client.FilesApi(api_client)
        project_id = int(os.environ["PROJECT_ID"])
        files_response = await api_instance.get_files(project_id)
        try:
            # 第一次创建文件
            api_response = await api_instance.create_file(
                project_id, file=file, path=path
            )
            pprint(api_response)
        except ValidationError as error:
            print(f"文件上传成功{path}en_us.json")
        except Exception as e:
            filePath: str = json.loads(e.__dict__.get("body"))["message"].split(" ")[1]
            for fileName in files_response:
                if fileName.name == filePath:
                    await api_instance.update_file(project_id, file_id=fileName.id, file=file)
                    print(f"文件已更新！文件路径为：{fileName.name}")


def get_filelist(dir):
    filelist = []
    for root, _, files in os.walk(dir):
        for file in files:
            if "en_us" in file and file.endswith(".json"):
                filelist.append(os.path.join(root, file))
    return filelist


async def main() -> None:
    """主函数：扫描并上传翻译文件"""
    try:
        # 获取文件列表
        files = get_filelist("./Source")
        if not files:
            print("未找到需要上传的文件")
            return
            
        # 准备上传任务
        tasks: List[asyncio.Task] = []
        for file_path in files:
            try:
                # 处理文件路径
                path = (
                    file_path.split("Source")[1]
                    .replace("\\", "/")
                    .replace(os.path.basename(file_path), "")
                )
                
                # 打开文件并创建上传任务
                with open(file_path, "rb") as f:
                    tasks.append(asyncio.create_task(upload_file(path, f)))
            except Exception as e:
                print(f"处理文件失败: {file_path}, 错误: {e}")
                continue
        
        # 执行所有上传任务
        if tasks:
            await asyncio.gather(*tasks)
            print("所有文件处理完成")
        else:
            print("没有可上传的文件")
    
    except Exception as e:
        print(f"执行失败: {e}")
        raise

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n程序被用户中断")
    except Exception as e:
        print(f"程序执行失败: {e}")
        raise
