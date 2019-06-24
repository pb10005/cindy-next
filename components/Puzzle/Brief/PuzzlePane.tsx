import styled from 'theme/styled';
import Panel from 'components/General/Panel';

import { PuzzlePaneProps } from './types';

const PuzzlePane = styled(Panel)<PuzzlePaneProps>`
  background: ${p => {
    switch (p.status) {
      case 0:
        return p.theme.colors.pink[0];
      case 1:
        return p.theme.colors.yellow[0];
      case 2:
        return p.theme.colors.blue[0];
      case 3:
      case 4:
        return p.theme.colors.gray[1];
      default:
        return 'rgba(255, 255, 255, 0.5)';
    }
  }};
`;

export default PuzzlePane;