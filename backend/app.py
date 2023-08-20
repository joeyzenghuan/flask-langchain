from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from urllib.parse import unquote
from decouple import config
from web import decode_website
# from doc import decoded_doc
from summary import summarize_webpage

import os
import nltk
nltk.data.path.append('nltk_data')

import openai

os.environ["OPENAI_API_KEY"] = config('OPENAI_API_KEY')
os.environ["OPENAI_API_TYPE"] = config('OPENAI_API_TYPE')
os.environ["OPENAI_API_BASE"] = config('OPENAI_API_BASE')
os.environ["OPENAI_API_VERSION"] = config('OPENAI_API_VERSION')

openai.api_type = config('OPENAI_API_TYPE')
openai.api_base = config('OPENAI_API_BASE')
openai.api_key = config('OPENAI_API_KEY')
openai.api_version = config('OPENAI_API_VERSION')



app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/data', methods=['GET','POST'])
def get_data():
    if request.method == 'GET':
        sample_data = {
            'message': 'Hello, Flask API!',
            'data': [1, 2, 3, 4, 5]
        }
        print ("DEBUG",sample_data)
        return jsonify(sample_data)
    
    elif request.method == 'POST':
        print ("DEBUG request",request)
        encode_url = unquote(unquote(request.args.get('url')))
        print ("DEBUG encode_url",encode_url)
        if not encode_url:
            return jsonify({'error': 'URL is required'}), 400

        decoded_text = decode_website(encode_url)

        print ("DEBUG decoded_text",decoded_text)

        #summary!!!!
        summary = summarize_webpage(decoded_text)

        response = {
            'submitted_url': encode_url,
            'summary': summary,
        }

        return jsonify(response)
        
@app.route('/api/gptnonstream', methods=['POST'])
def gptnonstream():
    data = request.get_json()
    prompt = data['prompt']
    response = openai.Completion.create(
        engine="text-davinci-003-deployment",
        prompt=prompt,
        temperature=0.9,
        max_tokens=150,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0.6,
        stop=[" Human:", " AI:"]
    )
    print(response.choices[0].text)

    return jsonify(
            {
            "gpt_response": response.choices[0].text
        }
    ), 201

if __name__ == "__main__":

    # This code block sets the port number for the Flask application and runs it.
    # The port number is obtained from the environment variable 'PORT', or defaults to 5001.
    # The application runs in debug mode and is accessible from any IP address.
    # This code block should be executed only if the script is run as the main program.

    port = int(os.environ.get('PORT', 5001))
    # app.run(debug=True, host='0.0.0.0', port=port)
    app.run(host='0.0.0.0', port=port)



