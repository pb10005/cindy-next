import React from 'react';
import styled from 'theme/styled';

import { connect } from 'react-redux';
import * as puzzleReducer from 'reducers/puzzle';

import { FormattedMessage } from 'react-intl';
import puzzleMessages from 'messages/components/puzzle';

import { Img, RedDot } from 'components/General';
import soupIcon from 'svgs/soup.svg';
import memoIcon from 'svgs/memo.svg';
import toTopIcon from 'svgs/toTop.svg';
import toBottomIcon from 'svgs/toBottom.svg';
import expandIcon from 'svgs/expand.svg';

import { ActionContentType, RightAsideType, StateType } from 'reducers/types';
import {
  RightAsideBoxBaseProps,
  RightAsideBoxProps,
  RightAsideBoxState,
  RightAsideBoxButtonProps,
} from './types';

const RightAsideBoxBase = styled.div<RightAsideBoxBaseProps>`
  display: flex;
  flex-wrap: wrap;
  position: fixed;
  margin-top: 1em;
  border-radius: ${p => p.theme.radii[2]}px;
  border-width: 0;
  width: ${p => (p.mini ? '2em' : '7em')};
  height: auto;
  top: ${p => p.theme.sizes.toolbar};
  right: 2px;
  opacity: 0.8;
  background-color: ${p => p.theme.colors.orange[2]};
  z-index: 180;
  visibility: ${p => (p.show ? 'visible' : 'hidden')};
  transform: ${p => (p.show ? 'none' : 'translateX(100%)')};
  transition-property: transform, opacity, visibility;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
`;

const RightAsideBoxButton = styled.button<RightAsideBoxButtonProps>`
  background: ${p =>
    p.on ? p.theme.colors.orange[3] : p.theme.colors.orange[2]};
  width: ${p => p.width || '3em'};
  height: ${p => p.height || '3em'};
  &:hover {
    background: ${p =>
      p.on ? p.theme.colors.orange[4] : p.theme.colors.orange[3]};
  }
  &:active {
    background: ${p =>
      p.on ? p.theme.colors.orange[5] : p.theme.colors.orange[4]};
  }
`;

class RightAsideBox extends React.Component<
  RightAsideBoxProps,
  RightAsideBoxState
> {
  state = {
    mini: false,
    showMini: true,
  };
  lastScrollTop = process.browser
    ? window.pageYOffset || document.documentElement.scrollTop
    : 0;
  handleScroll = () => {
    if (!this.state.mini) return;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY > this.lastScrollTop && scrollY > 50) {
      this.state.showMini === true && this.setState({ showMini: false });
    } else {
      this.state.showMini === false && this.setState({ showMini: true });
    }
    this.lastScrollTop = scrollY <= 0 ? 0 : scrollY;
  };
  componentDidMount = () => {
    process.browser && window.addEventListener('scroll', this.handleScroll);
  };
  componentWillUnmount = () => {
    process.browser && window.removeEventListener('scroll', this.handleScroll);
  };
  render() {
    const {
      rightAside,
      setRightAside,
      puzzleMemo,
      puzzleMemoHasnew,
    } = this.props;

    return (
      <RightAsideBoxBase
        mini={this.state.mini}
        show={!this.state.mini || this.state.showMini}
      >
        <RightAsideBoxButton
          width="100%"
          height={this.state.mini ? '2em' : '3em'}
          on={rightAside === RightAsideType.content}
          onClick={() =>
            setRightAside(
              rightAside === RightAsideType.content
                ? RightAsideType.none
                : RightAsideType.content,
            )
          }
        >
          <Img
            height={this.state.mini ? '1em' : '2em'}
            src={soupIcon}
            alt="Soup"
          />
          {!this.state.mini && <FormattedMessage {...puzzleMessages.content} />}
        </RightAsideBoxButton>
        {puzzleMemo !== '' && (
          <RightAsideBoxButton
            width="100%"
            height={this.state.mini ? '2em' : '3em'}
            on={rightAside === RightAsideType.memo}
            onClick={() =>
              setRightAside(
                rightAside === RightAsideType.memo
                  ? RightAsideType.none
                  : RightAsideType.memo,
              )
            }
          >
            {puzzleMemoHasnew && <RedDot right={this.state.mini ? 0 : '4em'} />}
            <Img
              height={this.state.mini ? '1em' : '2em'}
              src={memoIcon}
              alt="Memo"
            />
            {!this.state.mini && <FormattedMessage {...puzzleMessages.memo} />}
          </RightAsideBoxButton>
        )}
        <RightAsideBoxButton
          width={this.state.mini ? '100%' : '50%'}
          height={this.state.mini ? '2em' : '3em'}
          onClick={() =>
            window && window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        >
          <Img
            height={this.state.mini ? '1em' : '2em'}
            src={toTopIcon}
            alt="Top"
          />
        </RightAsideBoxButton>
        <RightAsideBoxButton
          width={this.state.mini ? '100%' : '50%'}
          height={this.state.mini ? '2em' : '3em'}
          onClick={() =>
            window &&
            window.scrollTo({
              top: document && document.body.scrollHeight,
              behavior: 'smooth',
            })
          }
        >
          <Img
            height={this.state.mini ? '1em' : '2em'}
            src={toBottomIcon}
            alt="Bottom"
          />
        </RightAsideBoxButton>
        <RightAsideBoxButton
          width="100%"
          height="2em"
          onClick={() => this.setState(p => ({ mini: !p.mini }))}
        >
          <Img height="1em" src={expandIcon} alt="Expand" />
        </RightAsideBoxButton>
      </RightAsideBoxBase>
    );
  }
}

const mapStateToProps = (state: StateType) => ({
  puzzleMemo: puzzleReducer.rootSelector(state).puzzleMemo,
  puzzleMemoHasnew: puzzleReducer.rootSelector(state).puzzleMemoHasnew,
  rightAside: puzzleReducer.rootSelector(state).rightAside,
});

const mapDispatchToProps = (dispatch: (action: ActionContentType) => void) => ({
  setRightAside: (rightAside: RightAsideType) =>
    dispatch(puzzleReducer.actions.setRightAside(rightAside)),
});

const withRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default withRedux(RightAsideBox);