import json
import os
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import EMAIL
import datetime as dt
dt.datetime.now()
t = dt.datetime.now()
print(f"{t.year}-{t.month}-{t.day} {t.hour}:{t.minute}:{t.second}")

printNowTime = f"{t.year}-{t.month}-{t.day} {t.hour}:{t.minute}:{t.second}"

json_file_path = './urls.json'

def send_email(recipient, url):
    sender_email = EMAIL.sender_email
    password = EMAIL.app_password
    
    message = MIMEMultipart("alternative")
    message["Subject"] = "URL 작동하지 않음"
    message["From"] = sender_email
    message["To"] = recipient

    text = f"{EMAIL.server}의 {url} 이(가) 작동하지 않습니다."
    part = MIMEText(text, "plain")
    message.attach(part)

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(sender_email, password)
        server.sendmail(sender_email, recipient, message.as_string())
        server.quit()
        
        print(f"{printNowTime} | 메일 전송 성공: {recipient}")
    except Exception as e:
        
        print(f"{printNowTime} | 메일 전송 실패: {e}")

def check_urls(json_data):
    for item in json_data.values():
        if isinstance(item, dict) and 'url' in item and 'mail' in item:
            url = item['url']
            mail = item['mail']
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    
                    print(f"{printNowTime} | {url} 정상 작동")
                    item['work'] = 1
                else:
                    
                    print(f"{printNowTime} | {url} 작동하지 않음, 메일을 보냅니다.")
                    item['work'] = 0
                    if mail != "NULL":
                        send_email(mail, url)
            except requests.exceptions.RequestException as e:
                
                print(f"{printNowTime} | {url} 연결 실패, 메일을 보냅니다.")
                item['work'] = 0
                if mail != "NULL":
                    send_email(mail, url)
    write_json(json_file_path, json_data)


def read_json(file_path):
    if not os.path.exists(file_path):
        
        print(f"파일이 없습니다. {file_path} 파일을 생성합니다.")
        default_data = {
            "http://example.com": {
                "url": "http://example.com",
                "mail": "NULL"
            }
        }
        write_json(file_path, default_data)
        return default_data
    with open(file_path, 'r') as file:
        return json.load(file)

def write_json(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

json_data = read_json(json_file_path)
check_urls(json_data)
