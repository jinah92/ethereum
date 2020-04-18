pragma solidity >=0.4.21 <0.7.0;


contract Sponsor {
    uint256 total; // 데이터 Type 데이터명

    function add(uint256 amount) public {
        //add 메소드
        total = total + amount;
    }

    function get() public view returns (uint256) {
        //get 메소드
        return total;
    }
}
