import React from 'react';
import { ButtonTransparent, Flex } from 'components/General';
import { widthSplits } from '../constants';

import { FormattedMessage } from 'react-intl';
import messages from 'messages/components/puzzle';

import { SetPanelToolbarProps, ControlPanelPanelType } from './types';

const PanelToolbarButonProps = {
  px: 1,
  borderBottom: '4px solid',
};

const activeColor = 'violet.5';

const SetPanelToolbar = ({
  currentPanel,
  setCurrentPanel,
  status,
}: SetPanelToolbarProps) => (
  <Flex width={1} mb={1}>
    {status === 0 && (
      <ButtonTransparent
        {...PanelToolbarButonProps}
        borderColor={
          currentPanel === ControlPanelPanelType.SOLUTION_EDIT
            ? activeColor
            : 'transparent'
        }
        onClick={() => setCurrentPanel(ControlPanelPanelType.SOLUTION_EDIT)}
      >
        <FormattedMessage {...messages.solution} />
      </ButtonTransparent>
    )}
    <ButtonTransparent
      {...PanelToolbarButonProps}
      borderColor={
        currentPanel === ControlPanelPanelType.MEMO_EDIT
          ? activeColor
          : 'transparent'
      }
      onClick={() => setCurrentPanel(ControlPanelPanelType.MEMO_EDIT)}
    >
      <FormattedMessage {...messages.memo} />
    </ButtonTransparent>
    {status === 0 && (
      <ButtonTransparent
        {...PanelToolbarButonProps}
        borderColor={
          currentPanel === ControlPanelPanelType.HINT_ADD
            ? activeColor
            : 'transparent'
        }
        onClick={() => setCurrentPanel(ControlPanelPanelType.HINT_ADD)}
      >
        <FormattedMessage {...messages.hint} />
      </ButtonTransparent>
    )}
    {status === 0 && (
      <ButtonTransparent
        {...PanelToolbarButonProps}
        borderColor={
          currentPanel === ControlPanelPanelType.PUZZLE_EDIT
            ? activeColor
            : 'transparent'
        }
        onClick={() => setCurrentPanel(ControlPanelPanelType.PUZZLE_EDIT)}
      >
        <FormattedMessage {...messages.general} />
      </ButtonTransparent>
    )}
  </Flex>
);

export default SetPanelToolbar;