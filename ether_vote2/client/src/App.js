import React, { Component } from "react";
import "./App.css";
import logo from "./vote_box.png";

class App extends Component {
  state = {
    totalVoteNum: 0, //총투표수
    titleMsg: "잠시만 기다려주세요. 투표 서버에 접속 중입니다...",
    candidate: "", //후보자
    totalVotesFor: 0, //득표수
    contractAddress: "",
  };

  componentDidMount = async () => {
    fetch("http://localhost:4000/api/init")
      .then((res) => res.json())
      .then((parsedData) => this.setState({ titleMsg: parsedData.titleMsg }));
  };

  vote = async (e) => {
    e.preventDefault();
    const candidate = this.voteForm.candidate.value;
    if (window.confirm(candidate + "를 선택하셨습니다. 맞습니까?")) {
      const a = {
        candidate: candidate,
        voter: this.voterAccount.value,
      };
      console.log(a);
      fetch("http://localhost:4000/api/vote", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(a),
      })
        .then((res) => res.json())
        .then((parsedData) => {
          if (parsedData.deny) {
            alert("이미 투표하셨습니다.");
          } else {
            this.setState({
              titleMsg: parsedData.titleMsg,
              totalVoteNum: parsedData.totalVoteNum,
              candidate: parsedData.candidate,
              totalVotesFor: parsedData.totalVotesFor,
            });
          }
          this.voterAccount.value = "";
          this.voterAccount.focus();
        });
    }
  };

  render() {
    return (
      <div className="App">
        <h1>{this.state.titleMsg} </h1>
        <img src={logo} />
        <h2>회장 선출</h2>
        <input placeholder="당신의 계정을 입력하세요." ref={(ref) => (this.voterAccount = ref)} />
        <h3>다음 중 회장으로 선출되길 원하시는 사람 한 명을 선택하고 투표 버튼을 누르세요</h3>
        <form ref={(ref) => (this.voteForm = ref)} onSubmit={this.vote}>
          <br />
          <input type="radio" name="candidate" value="홍길동" /> 홍길동
          <br />
          <input type="radio" name="candidate" value="이영애" /> 이영애
          <br />
          <input type="radio" name="candidate" value="전지현" /> 전지현
          <br />
          <input type="radio" name="candidate" value="박보검" /> 박보검
          <br />
          <input type="radio" name="candidate" value="장동건" /> 장동건
          <br />
          <button type="submit"> 투표</button>
        </form>
        <div>전체 투표 수: {this.state.totalVoteNum}</div>
        <div>
          {this.state.candidate} 후보자의 득표 수: {this.state.totalVotesFor}
        </div>
      </div>
    );
  }
}

export default App;
