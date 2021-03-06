import React, { Component } from 'react';
import { Main } from '../../components';
import { Login } from '../../components';

import * as service from '../../service/babelfish';

class Content extends Component {
  state = {
    viewid: 0, // 미로그인 : 0, 로그인성공 : 1, 
    api_fetching: false, // 질의가 진행중일경우 true
    error: false, // 에러가 발생했을경우
    error_msg: "", //  에러 메시지 코드
    userid: "", //유저 아이디
    notes: {}, //보유 노트 리스트
    words: {}, // 단어 리스트 focusNoteId 기반
    focusNoteId: 0,
    focusWordId: 0
  }
  logindataManipulation = async (data) => {
    //console.log(`데이터 연결 정상`);
    //console.log(data);
    try {
      this.setState({ api_fetching: true });// 질의 진행 상태설정
      console.log(data.email);
      console.log(data.password);
      const post = await service.getToken(data.email, data.password); //질의
      console.log()
      sessionStorage.setItem("token", post.data.token); // 토큰정보 세션에 저장

      //console.log(sessionStorage.getItem("token")); // 토큰정보 출력
      this.setState({ viewid: 1, api_fetching: false, userid: data.email });// 질의 성공 상태설정
    } catch (error) {
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        //console.log(error.response.data); // 서버응답
        //console.log(error.response.status); //400
        //console.log(error.response.headers);
        this.setState({ api_fetching: false, error: true, error_msg: error.response.data.msg_code });// 질의 진행 상태설정
      }
      else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        //console.log(error.request);
        this.setState({ api_fetching: false, error: true, error_msg: "api_server_offline_점검중입니다" });// 질의 진행 상태설정
      }
      else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
        this.setState({ api_fetching: false, error: true, error_msg: "front_server_error" });// 질의 진행 상태설정
      }
      console.log(error.config);
    }
    //console.log(`분기완료 상태 출력`);
    //console.log(this.state);
  }
  userNoteDataLoad = async () => {
    try {
      //TODO
      //1.상태 설정 - 질의 진행중
      //2.API 통신 진행
      //3.상태 설정 - 질의 종료 및 데이터 동기화
      console.log(`시작`);
      //1.상태 설정 - 질의 진행중
      this.setState({ api_fetching: true });
      //2.API 통신 진행
      const get = await service.getNotes(sessionStorage.getItem("token"), this.state.userid);
      //3.상태 설정 - 질의 종료 및 데이터 동기화
      this.setState({ api_fetching: false, notes: get.data.data });
      //console.log(get.data.data); //단어장 리스트
    } catch (error) {
      // 토큰정보가 유효하지 않을경우 로그인창으로
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        //console.log(error.response.data); // 서버응답
        //console.log(error.response.status); //400
        //console.log(error.response.headers);
        if (error.response.status === 404) {
          this.setState({ api_fetching: false, error: false, error_msg: "", notes: {} });
        } else {
          this.setState({ api_fetching: false, error: true, error_msg: error.response.data.msg_code });// 질의 진행 상태설정
        }
      }
      else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        //console.log(error.request);
        this.setState({ api_fetching: false, error: true, error_msg: "api_server_offline_점검중입니다" });// 질의 진행 상태설정
      }
      else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
        this.setState({ api_fetching: false, error: true, error_msg: "front_server_error" });// 질의 진행 상태설정
      }
      console.log(error.config);
    }
    console.log(`종료`);
    //console.log(`분기완료 상태 출력`);
    //console.log(this.state);
  }
  userNoteCreate = async (notename) => {
    //TODO
    //1.상태 설정 - 질의 진행중
    //2.API 통신 진행
    //3. 노트 리스트 동기화
    //4.상태 설정 - 질의 종료
    try {
      //1.상태 설정 - 질의 진행중
      this.setState({ api_fetching: true });
      //2.API 통신 진행
      await service.createNote(sessionStorage.getItem("token"), this.state.userid, notename);
      //3. 노트 리스트 동기화
      await this.userNoteDataLoad();
      //4.상태 설정 - 질의 종료
      this.setState({ viewid: 2, api_fetching: false });// 질의 성공 상태설정
    } catch (error) {
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        //console.log(error.response.data); // 서버응답
        //console.log(error.response.status); //400
        //console.log(error.response.headers);
        this.setState({ api_fetching: false, error: true, error_msg: error.response.data.msg_code });// 질의 진행 상태설정
      }
      else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        //console.log(error.request);
        this.setState({ api_fetching: false, error: true, error_msg: "api_server_offline_점검중입니다" });// 질의 진행 상태설정
      }
      else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
        this.setState({ api_fetching: false, error: true, error_msg: "front_server_error" });// 질의 진행 상태설정
      }
      console.log(error.config);
    }
  }
  userNoteDelete = async (noteid) => {
    //TODO
    //1.상태 설정 - 질의 진행중
    //2.API 통신 진행
    //3. 노트 리스트 동기화
    //4.상태 설정 - 질의 종료
    try {
      //1.상태 설정 - 질의 진행중
      this.setState({ api_fetching: true });
      //2.API 통신 진행
      await service.deleteNote(sessionStorage.getItem("token"), this.state.userid, noteid);
      //3. 노트 리스트 동기화
      await this.userNoteDataLoad();
      //4.상태 설정 - 질의 종료
      this.setState({ viewid: 2, api_fetching: false });// 질의 성공 상태설정
    } catch (error) {
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        //console.log(error.response.data); // 서버응답
        //console.log(error.response.status); //400
        //console.log(error.response.headers);
        this.setState({ api_fetching: false, error: true, error_msg: error.response.data.msg_code });// 질의 진행 상태설정
      }
      else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        //console.log(error.request);
        this.setState({ api_fetching: false, error: true, error_msg: "api_server_offline_점검중입니다" });// 질의 진행 상태설정
      }
      else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
        this.setState({ api_fetching: false, error: true, error_msg: "front_server_error" });// 질의 진행 상태설정
      }
      console.log(error.config);
    }
  }
  userWordsDataLoad = async () => {
    try {
      //TODO
      //1.상태 설정 - 질의 진행중
      //2.API 통신 진행
      //3. 노트 리스트 동기화
      //4.상태 설정 - 질의 종료
      this.setState({ api_fetching: true });
      const get = await service.getWord(sessionStorage.getItem("token"), this.state.userid, this.state.focusNoteId);
      this.setState({ viewid: 7, api_fetching: false, words: get.data.data });// 질의 성공 상태설정
    } catch (error) {
      // 토큰정보가 유효하지 않을경우 로그인창으로
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        //console.log(error.response.data); // 서버응답
        //console.log(error.response.status); //400
        //console.log(error.response.headers);
        if (error.response.status === 404) {
          this.setState({ words: {} }); // 질의결과가 없는경우 단어장 리스트 초기화
        } else {
          this.setState({ api_fetching: false, error: true, error_msg: error.response.data.msg_code });// 질의 진행 상태설정
        }
      }
      else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        //console.log(error.request);
        this.setState({ api_fetching: false, error: true, error_msg: "api_server_offline_점검중입니다" });// 질의 진행 상태설정
      }
      else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
        this.setState({ api_fetching: false, error: true, error_msg: "front_server_error" });// 질의 진행 상태설정
      }
      console.log(error.config);
    }
  }
  userWordsDelete = async () => {
    //TODO
    //1.상태 설정 - 질의 진행중
    //2.API 통신 진행
    //3. 노트 리스트 동기화
    //4.상태 설정 - 질의 종료
    try {
      //1.상태 설정 - 질의 진행중
      this.setState({ api_fetching: true });
      //2.API 통신 진행
      await service.deleteWord(sessionStorage.getItem("token"), this.state.userid, this.state.focusNoteId, this.state.focusWordId);
      //3. 단어 리스트 동기화
      await this.userWordsDataLoad();
      //4.상태 설정 - 질의 종료
      this.setState({ viewid: 7, api_fetching: false });// 질의 성공 상태설정
    } catch (error) {
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        //console.log(error.response.data); // 서버응답
        //console.log(error.response.status); //400
        //console.log(error.response.headers);
        this.setState({ api_fetching: false, error: true, error_msg: error.response.data.msg_code });// 질의 진행 상태설정
      }
      else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        //console.log(error.request);
        this.setState({ api_fetching: false, error: true, error_msg: "api_server_offline_점검중입니다" });// 질의 진행 상태설정
      }
      else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
        this.setState({ api_fetching: false, error: true, error_msg: "front_server_error" });// 질의 진행 상태설정
      }
      console.log(error.config);
    }
  }
  userWordsCreate = async (title, mean1, mean2) => {

    //TODO
    //1.상태 설정 - 질의 진행중
    //2.API 통신 진행
    //3. 노트 리스트 동기화
    //4.상태 설정 - 질의 종료
    try {
      //1.상태 설정 - 질의 진행중
      this.setState({ api_fetching: true });
      //2.API 통신 진행
      await service.createWord(sessionStorage.getItem("token"), this.state.userid, this.state.focusNoteId, title, mean1, mean2);
      //3. 노트 리스트 동기화
      await this.userWordsDataLoad();
      //4.상태 설정 - 질의 종료
      this.setState({ viewid: 7, api_fetching: false });// 질의 성공 상태설정
    } catch (error) {
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        //console.log(error.response.data); // 서버응답
        //console.log(error.response.status); //400
        //console.log(error.response.headers);
        this.setState({ api_fetching: false, error: true, error_msg: error.response.data.msg_code });// 질의 진행 상태설정
      }
      else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        //console.log(error.request);
        this.setState({ api_fetching: false, error: true, error_msg: "api_server_offline_점검중입니다" });// 질의 진행 상태설정
      }
      else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
        this.setState({ api_fetching: false, error: true, error_msg: "front_server_error" });// 질의 진행 상태설정
      }
      console.log(error.config);
    }
  }
  userNoteModify = async (notename) => { //usertoken, userid, notename, noteid
    //TODO
    //1.상태 설정 - 질의 진행중
    //2.API 통신 진행
    //3. 노트 리스트 동기화
    //4.상태 설정 - 질의 종료
    try {
      //1.상태 설정 - 질의 진행중
      this.setState({ api_fetching: true });
      //2.API 통신 진행
      await service.modifyNote(sessionStorage.getItem("token"), this.state.userid, notename, this.state.focusNoteId);
      //3. 노트 리스트 동기화
      await this.userNoteDataLoad();
      //4.상태 설정 - 질의 종료
      this.setState({ viewid: 2, api_fetching: false });// 질의 성공 상태설정
    } catch (error) {
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        //console.log(error.response.data); // 서버응답
        //console.log(error.response.status); //400
        //console.log(error.response.headers);
        this.setState({ api_fetching: false, error: true, error_msg: error.response.data.msg_code });// 질의 진행 상태설정
      }
      else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        //console.log(error.request);
        this.setState({ api_fetching: false, error: true, error_msg: "api_server_offline_점검중입니다" });// 질의 진행 상태설정
      }
      else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
        this.setState({ api_fetching: false, error: true, error_msg: "front_server_error" });// 질의 진행 상태설정
      }
      console.log(error.config);
    }
  }
  userWordsModify = async (title, mean1, mean2) => { //modifyWord(usertoken, userid, noteid, wordid, title, mean1, mean2) {

    //TODO
    //1.상태 설정 - 질의 진행중
    //2.API 통신 진행
    //3. 노트 리스트 동기화
    //4.상태 설정 - 질의 종료
    try {
      //1.상태 설정 - 질의 진행중
      this.setState({ api_fetching: true });
      //2.API 통신 진행
      await service.modifyWord(sessionStorage.getItem("token"), this.state.userid, this.state.focusNoteId, this.state.focusWordId, title, mean1, mean2);
      //3. 노트 리스트 동기화
      await this.userWordsDataLoad();
      //4.상태 설정 - 질의 종료
      this.setState({ viewid: 7, api_fetching: false });// 질의 성공 상태설정
    } catch (error) {
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        //console.log(error.response.data); // 서버응답
        //console.log(error.response.status); //400
        //console.log(error.response.headers);
        this.setState({ api_fetching: false, error: true, error_msg: error.response.data.msg_code });// 질의 진행 상태설정
      }
      else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        //console.log(error.request);
        this.setState({ api_fetching: false, error: true, error_msg: "api_server_offline_점검중입니다" });// 질의 진행 상태설정
      }
      else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
        this.setState({ api_fetching: false, error: true, error_msg: "front_server_error" });// 질의 진행 상태설정
      }
      console.log(error.config);
    }
  }
  userNoteLearningDayUpdate = async () => { //updatedNote(usertoken, userid, noteid) {
    //TODO
    //1.상태 설정 - 질의 진행중
    //2.API 통신 진행
    //3. 노트 리스트 동기화
    //4.상태 설정 - 질의 종료
    try {
      //1.상태 설정 - 질의 진행중
      this.setState({ api_fetching: true });
      //2.API 통신 진행
      await service.updatedNote(sessionStorage.getItem("token"), this.state.userid, this.state.focusNoteId);
      //3. 노트 리스트 동기화
      await this.userNoteDataLoad();
      //4.상태 설정 - 질의 종료
      this.setState({ api_fetching: false });// 질의 성공 상태설정
    } catch (error) {
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        //console.log(error.response.data); // 서버응답
        //console.log(error.response.status); //400
        //console.log(error.response.headers);
        this.setState({ api_fetching: false, error: true, error_msg: error.response.data.msg_code });// 질의 진행 상태설정
      }
      else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        //console.log(error.request);
        this.setState({ api_fetching: false, error: true, error_msg: "api_server_offline_점검중입니다" });// 질의 진행 상태설정
      }
      else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
        this.setState({ api_fetching: false, error: true, error_msg: "front_server_error" });// 질의 진행 상태설정
      }
      console.log(error.config);
    }
  }
  userWordsWrongCountUpdate = async (wordid) => { //wrongCountWord(usertoken, userid, noteid, wordid)
    //TODO
    //1.상태 설정 - 질의 진행중
    //2.API 통신 진행
    //3. 노트 리스트 동기화
    //4.상태 설정 - 질의 종료
    try {
      //1.상태 설정 - 질의 진행중
      this.setState({ api_fetching: true });
      //2.API 통신 진행
      await service.wrongCountWord(sessionStorage.getItem("token"), this.state.userid, this.state.focusNoteId, wordid);
      //4.상태 설정 - 질의 종료
      this.setState({ api_fetching: false });// 질의 성공 상태설정
    } catch (error) {
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        //console.log(error.response.data); // 서버응답
        //console.log(error.response.status); //400
        //console.log(error.response.headers);
        this.setState({ api_fetching: false, error: true, error_msg: error.response.data.msg_code });// 질의 진행 상태설정
      }
      else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        //console.log(error.request);
        this.setState({ api_fetching: false, error: true, error_msg: "api_server_offline_점검중입니다" });// 질의 진행 상태설정
      }
      else {
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
        this.setState({ api_fetching: false, error: true, error_msg: "front_server_error" });// 질의 진행 상태설정
      }
      console.log(error.config);
    }
  }
  //상태변경
  // 모든 컴포넌트 뷰아이디 상태변경 처리
  changeViewId = (value) => {
    this.setState({ viewid: Number(value) });
  }
  changeFocusNoteId = async (value) => {
    this.setState({ focusNoteId: value });
    //this.userWordsDataLoad();
  }
  changeFocusWordId = async (value) => {
    this.setState({ focusWordId: value });
  }
  modalHide = () => {
    if(this.state.error_msg === '4'){
      this.setState({ error: false, error_msg: "", viewid:0 });
    }else{
      this.setState({ error: false, error_msg: "" });
    }
  }
  modalText = () => {
    switch (this.state.error_msg) {
      case 't1':
        return '아이디 또는 패스워드에 허용되지 않는 문자가 있습니다';
      case 't2':
        return '아이디 또는 패스워드가 올바르지 않습니다';
      case '4':
        return '로그아웃 되었습니다 다시 로그인해 주세요';
      case 'n2-1':
        return '노트 이름에 허용되지 않는 문자가 있거나 노트 이름이 너무 깁니다';
        case 'n3-1':
          return '노트 이름에 허용되지 않는 문자가 있거나 노트 이름이 너무 깁니다';
      case 'n5-1':
        return '노트 이름에 허용되지 않는 문자가 있거나 노트 이름이 너무 깁니다';
      case 'w2-1':
        return '허용되지 않는 문자 또는 텍스트가 너무 길어 등록에 실패했습니다';
      case 'w3-1':
        return '허용되지 않는 문자 또는 텍스트가 너무 길어 등록에 실패했습니다';
      default:
        return `비정상적인 요청입니다 ${this.state.error_msg}`;
    }
  }
  render() {
    const errmsg = this.modalText();
    const modal = this.state.error ? (
      <div class="flex fixed h-full w-full items-center justify-center bg-transparent z-50">
        <div className="w-full xl:w-96 h-15 bg-white rounded-lg shadow-md p-4">
          <div>
            <h1 class="subpixel-antialiased text-gray-600 mb-3">{errmsg}</h1>
          </div>
          <hr ></hr>
          <div class="flex flex-row-reverse">
            <button onClick={this.modalHide} class="text-blue-400 mt-3">확인</button>
          </div>
        </div>
      </div>
    ) : null;
    return (
      <div>
        {modal}
        {this.state.viewid === 0 && (<Login logindataManipulation={this.logindataManipulation} />)/*로그인 필요시*/}

        {this.state.viewid >= 1 && (<Main
          userNoteDataLoad={this.userNoteDataLoad}  // 노트 리스트 동기화
          NotesData={this.state.notes}  // 노트 리스트 데이터
          WordsData={this.state.words} //단어 리스트 데이터
          focusNoteId={this.state.focusNoteId} // 현재 위치 노트 아이디
          focusWordId={this.state.focusWordId} // 현재 위치 단어 아이디
          api_fetching={this.state.api_fetching} // api 질의 진행 상태
          changeViewId={this.changeViewId} // 뷰 상태 데이터 변경
          viewId={this.state.viewid} // 뷰 상태 데이터
          userNoteCreate={this.userNoteCreate} //노트 생성
          userNoteDelete={this.userNoteDelete} // 노트 삭제
          userNoteModify={this.userNoteModify} //노트수정
          changeFocusNoteId={this.changeFocusNoteId}//보고있는 노트 아이디
          changeFocusWordId={this.changeFocusWordId}//보고있는 단어 아이디
          userWordsDataLoad={this.userWordsDataLoad}//단어 리스트 api
          userWordsDelete={this.userWordsDelete} //유저 단어 삭제
          userWordsCreate={this.userWordsCreate} //유저 단어 생성
          userWordsModify={this.userWordsModify}//유저 단어 수정
          userNoteLearningDayUpdate={this.userNoteLearningDayUpdate}
          userWordsWrongCountUpdate={this.userWordsWrongCountUpdate}
        />)}
      </div>
    );
  }
}

export default Content;