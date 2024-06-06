import schedule
import time
import subprocess

print("working 1")

def job():
    print("Ping.py 실행 중...")
    subprocess.run(["python", "ping.py"])

schedule.every(1).hours.do(job)
print("working 2")

while True:
    schedule.run_pending()
    time.sleep(1)
