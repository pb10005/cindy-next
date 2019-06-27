import styled from 'theme/styled';
import { typography, space, SpaceProps } from 'styled-system';
import { HeadingDefaultProps, TypographyProps } from './types';

const Heading = styled.div<TypographyProps & SpaceProps>`
  color: ${p => p.theme.colors.red[9]};
  margin-left: 50px;
  margin-bottom: 20px;
  padding-top: 30px;
  ${p => p.theme.mediaQueries.small} {
    margin-left: 25px;
    margin-bottom: 10px;
    padding-top: 15px;
  }
  ${typography}
  ${space}
`;

Heading.defaultProps = HeadingDefaultProps;

export default Heading;
