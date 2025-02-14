import os

def list_files_in_directory(directory):
    file_names = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_names.append(file)
    return file_names

# 指定文件夹路径
directory_path = 'D:/mc/地图/FTB-Oceanblock-2-Chinese/Source/kubejs/assets/quests/lang/'

# 获取文件名列表
file_names = list_files_in_directory(directory_path)

# 打印文件名
for file_name in file_names:
    print(file_name)