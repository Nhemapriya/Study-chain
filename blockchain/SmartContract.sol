// SPDX-License-Identifier: MIT
pragma solidity >0.4.21;
contract StudyToken {
    
    event UserAdded(string indexed uid,string indexed role);
    event UserRateUpdation(string indexed uid, uint64 rating );

    
    struct LEARNER{
        string uid;
        string name;
        string location;
        string status;
        uint64  rating;
        uint64 balance;
        bool    exists;
    }
    
    struct CURATOR{
        string uid;
        string name;
        string location;
        string status;
        uint64  rating;
        uint64 balance;
        bool    exists;
    }
    
    struct GROUP{
        string uid;
        string name;
        string domain;  
        string admin;
        string status;
        uint64  source;
        uint64 balance;
        bool    exists;
    }
    
    mapping(string => LEARNER) public learners;
    mapping(string => CURATOR) public curators;
    mapping(string => GROUP) public groups;


     function addUser(string memory _uid,string memory _name,string memory _location,string memory _status,uint64  _balance) public returns (bool) {
        require( learners[_uid].exists == false, "User was already registered");
        
        LEARNER memory newLearner = LEARNER({uid: _uid, name : _name, location : _location, status : _status, rating : 100, balance : _balance, exists : true});
        learners[_uid]=newLearner;
        emit UserAdded(_uid,"learner");
        return true;
    }
    
    function checkRating(string memory _uid) public view returns(uint64)
    {
    //   require(products[_productId].exists != true, "Product does not exist");
    if(learners[_uid].exists == false)
    {
        return 0;
    }
    else
      {
          return learners[_uid].rating;
      }      
    }
    
     function updateRating(string memory _uid, uint64  _rating) public payable returns(bool)
    {
    //   require(products[_productId].exists != true, "Product does not exist");
    if(learners[_uid].exists == false)
    {
        return false;
    }
    else
      {
          
          learners[_uid].rating = _rating;
          emit UserRateUpdation(_uid,_rating);

          return true;
      }      
    }
    
    
    
}