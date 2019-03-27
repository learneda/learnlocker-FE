import styled from 'styled-components';

// variables
export const bgColor = '#e6e9f3';
export const hoverBg = '#d3d7e7';
export const buttonBg = '#4163f2';

// Flexbox custom layout
export const customLayout = (justify = 'flex-start', align = 'flex-start') =>
  `display: flex;
  justify-content: ${justify};
  align-items: ${align};`;

export const Container = styled.div`
  // border: 1px solid green;
  width: 100%;
  background-color: ${bgColor};
`;

export const Wrapper = styled.div`
  // border: 1px solid blue;
  max-width: 1000px;
  width: 80%;
  margin: 0 auto;
`;
