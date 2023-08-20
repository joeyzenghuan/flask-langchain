// import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect, useFef } from 'react';
import axios from 'axios';

const App = () => {

  //states
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "bot",
      content: "Hi, how can I help you?"
    }
  ]);

  const url = "http://localhost:5001/api/gptnonstream";
  //HandleSubmit
  const handleSubmit = async () => {
    setLoading(true);

    //把使用者輸入的訊息  加入到chatHistory
    let newChatHistory = [
      ...chatHistory, {
        role: 'me',
        content: `${inputMsg}`
      }
    ];

    setChatHistory(newChatHistory);

    //清空inputMsg
    setInputMsg("");

    //把chatHistory 轉成一個字串
    const promptMessage = newChatHistory.map((msg) => msg.content).join("\n");
    console.log('promptMessage' , promptMessage);

    //call api
    try {
      const { data } = await axios.post(url, {
        prompt: promptMessage
      });
      console.log('gpt_response:' , data.gpt_response);

      //把生成的回覆加入到chatHistory
      setChatHistory([
        ...newChatHistory,
        {
          role: 'bot',
          content: `${data.gpt_response}`
        }
      ]);
      setLoading(false);

    } catch (error) {
      console.log(error);
    }

  }

  //onKeyDown
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
      // setInputMsg("");
    }
  }

  // clear chat
  const clearChat = () => {
    setChatHistory([]);
  }


  return (
    <div className="App">
      <div className="container py-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-6">
            <div className="card" id="chat2">
              <div className="card-header d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0">Doubao GPT</h5>
                <button
                  type="button"
                  className="btn btn-dark btn-sm"
                  data-mdb-ripple-color="dark"
                  onClick={clearChat}
                >
                  Clear Chat
                </button>
              </div>


              <div
                className="card-body"
                data-mdb-perfect-scrollbar="true"
                style={{ position: "relative", height: 400 }}
              >
                {
                  chatHistory.map((msg, index) => {
                    // console.log(msg);
                    return (
                      <div key={index}>
                        {
                          msg.role === 'me' ?
                            <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                              <div>
                                <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                                  {msg.content}
                                </p>

                                <p className="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">
                                  00:06
                                </p>
                              </div>
                              <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                                alt="avatar 1"
                                style={{ width: 45, height: "100%" }}
                              />
                            </div>
                            :
                            <div className="d-flex flex-row justify-content-start">
                              <img
                                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                                alt="avatar 1"
                                style={{ width: 45, height: "100%" }}
                              />
                              <div>
                                <p
                                  className="small p-2 ms-3 mb-1 rounded-3"
                                  style={{ backgroundColor: "#f5f6f7" }}
                                >
                                  {msg.content}
                                </p>

                                <p className="small ms-3 mb-3 rounded-3 text-muted">23:58</p>
                              </div>
                            </div>
                        }
                      </div>
                    )
                  }
                  )}
                  

              </div>
              <div className="card-footer text-muted d-flex justify-content-start align-items-center p-3">
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                  alt="avatar 3"
                  style={{ width: 40, height: "100%" }}
                />
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="exampleFormControlInput1"
                  placeholder="Type message"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={onKeyDown}
                />
                {/*                 
                <a className="ms-1 text-muted" href="#!">
                  <i className="fas fa-paperclip" />
                </a>
                <a className="ms-3 text-muted" href="#!">
                  <i className="fas fa-smile" />
                </a> */}

                {
                  loading ? ('GPT is typing...') :
                    (<a className="ms-3" href="#!" onClick={handleSubmit}>
                      <i className="fas fa-paper-plane" />
                    </a>)
                }

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
