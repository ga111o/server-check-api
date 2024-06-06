import json
import os
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import EMAIL

json_file_path = './urls.json'

# 이메일 전송 함수
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
        print(f"메일 전송 성공: {recipient}")
    except Exception as e:
        print(f"메일 전송 실패: {e}")

# URL 상태를 확인하고 JSON 데이터에 기록하는 함수
def check_urls(json_data):
    for item in json_data.values():
        if isinstance(item, dict) and 'url' in item and 'mail' in item:
            url = item['url']
            mail = item['mail']
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    print(f"{url} 정상 작동")
                    item['work'] = 1
                else:
                    print(f"{url} 작동하지 않음, 메일을 보냅니다.")
                    item['work'] = 0
                    # mail 값이 null이 아닐 때만 메일을 보냄
                    if mail != "NULL":
                        send_email(mail, url)
            except requests.exceptions.RequestException as e:
                print(f"{url} 연결 실패, 메일을 보냅니다.")
                item['work'] = 0
                # mail 값이 null이 아닐 때만 메일을 보냄
                if mail != "NULL":
                    send_email(mail, url)
    write_json(json_file_path, json_data)


# JSON 파일을 읽는 함수
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

# JSON 파일을 쓰는 함수
def write_json(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# 메인 실행 부분
json_data = read_json(json_file_path)
check_urls(json_data)
