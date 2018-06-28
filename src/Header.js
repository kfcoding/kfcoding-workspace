import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  background-color: #222;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  height: 40px;
  font-weight: 400;
  flex: 0 0 40px;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #444;
`;

class Header extends React.Component {

  render() {
    return(
      <Container>
        Header
      </Container>
    )
  }
}

export default Header;