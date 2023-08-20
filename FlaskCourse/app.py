from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    my_int = 42
    my_str = "Hello, world!"
    my_list = [1, 2, 3, 4, 5]
    my_dict = {"name": "John", "age": 30, "city": "New York"}

    return render_template(
        "index.html", my_int=my_int, my_str=my_str, my_list=my_list, my_dict=my_dict
    )


if __name__ == "__main__":
    app.run(debug=True)
