#!/bin/bash

# 啟動 SQL Server 在背景
echo "Starting SQL Server..."
/opt/mssql/bin/sqlservr &

# 等待 SQL Server 完全啟動
echo "Waiting for SQL Server to start..."
sleep 60

# 檢查 SQL Server 是否準備就緒
until /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "SELECT 1" &> /dev/null
do
  echo "Waiting for SQL Server to be ready..."
  sleep 5
done

echo "SQL Server is ready. Starting database restore..."

# 執行資料庫還原
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -Q "
RESTORE DATABASE [Std_info_sys] 
FROM DISK = N'/var/opt/mssql/backup/Std_info_sys.bak' 
WITH 
  MOVE 'Std_info_sys' TO '/var/opt/mssql/data/Std_info_sys.mdf',
  MOVE 'Std_info_sys_Log' TO '/var/opt/mssql/data/Std_info_sys_log.ldf',
  REPLACE
"

# 保持容器運行
echo "Keeping container alive..."
tail -f /dev/null