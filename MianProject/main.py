from flask import Flask, render_template, request
from flask_wtf import FlaskForm
from wtforms import FileField

app =Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/create_file',methods=['POST'])
def create_file():
    if request.method=='POST':
        with open(f"{request.form.get('name1')}.txt","w") as f:
            f.write('Evaluation Done')
        print(request.form.get('name1'))
        return('',204)

if __name__=='__main__':
    app.run(
        host='127.0.0.1',
        port=5001,
        debug=True
    )