from flask import Flask, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello, world!'

@app.route('/admin')
def admin():
    return 'Hello, admin!'

@app.route('/guest/<guest>')
def guest(guest):
    return f'Hello, {guest}!'

@app.route('/user/<name>')
def user(name):
    if name == 'admin':
        return redirect(url_for('admin'))
    else:
        return redirect(url_for('guest', guest=name))

if __name__ == '__main__':
    app.run(debug=True)