from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)
FILE_PATH = './urls.json'
API_USAGE = {
    "1. manual": {
        "1시간마다 url 체크 후, 접속이 되지 않는다면 입력한 이메일로 메일 전송": "",
        "이메일은 필수가 아님": "",
    },
    "2. how can i use": {
    "show_all_urls": "/",
    "add_url": "/add?url=<URL>&mail=<EMAIL>",
    "delete_url": "/del?url=<URL>",
    },
}

def read_urls():
    if os.path.exists(FILE_PATH):
        with open(FILE_PATH, 'r') as file:
            data = json.load(file)
            return {k: v for k, v in data.items() if k != "usage"}
    else:
        return {}

def write_urls(urls):
    with open(FILE_PATH, 'w') as file:
        data = {**API_USAGE, **urls}
        json.dump(data, file, indent=4)

@app.route('/add', methods=['GET'])
def add_url():
    address = request.args.get('url')
    mail = request.args.get('mail')

    if not address:
        return jsonify({"error": "'url' parameter is required"}), 400

    if not mail:
        mail = "NULL"
    urls = read_urls()
    urls[address] = {"url": address, "mail": mail if mail else None}
    write_urls(urls)

    return jsonify({"message": "URL added successfully", "data": urls[address]})

@app.route('/del', methods=['GET'])
def delete_url():
    address = request.args.get('url')

    urls = read_urls()

    if address in urls:
        del urls[address]
        write_urls(urls)
        return jsonify({"message": "URL deleted successfully"})
    else:
        return jsonify({"error": "URL not found"}), 404

@app.route('/', methods=['GET'])
def show_all_urls():
    urls = read_urls()
    return jsonify({**API_USAGE, **urls})

if __name__ == '__main__':
    app.run(port=9973, host="0.0.0.0")
