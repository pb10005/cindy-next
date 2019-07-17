import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styled from 'theme/styled';

import { FormattedMessage } from 'react-intl';
import puzzleMessages from 'messages/components/puzzle';

import { Query } from 'react-apollo';
import { PUZZLE_COMMENT_AGGREGATE_QUERY } from 'graphql/Queries/Comment';

import { Waypoint } from 'react-waypoint';
import { Box, Flex, Img, Button } from 'components/General';
import { Modal, ModalHeader, ModalCloseBtn } from 'components/Modal';
import CommentModalComments from './CommentModalComments';
import CommentModalAddPanel from './CommentModalAddPanel';

import commentIcon from 'svgs/puzzleDetailComment.svg';

import { CommentPanelProps } from './types';
import {
  PuzzleCommentAggregateQuery,
  PuzzleCommentAggregateQueryVariables,
} from 'graphql/Queries/generated/PuzzleCommentAggregateQuery';

const CommentButton = styled(Button)`
  background: transparent;
  &:hover {
    background: rgb(0, 0, 0, 0.05);
  }
  &:active {
    background: rgb(0, 0, 0, 0.1);
  }
`;

const CommentPanel = ({ puzzleId, canAddComment }: CommentPanelProps) => {
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [puzzleId]);

  return (
    <React.Fragment>
      <Waypoint
        key="puzzle-comment-panel"
        onEnter={() => !loaded && setLoaded(true)}
      />
      {loaded && (
        <Query<
          PuzzleCommentAggregateQuery,
          PuzzleCommentAggregateQueryVariables
        >
          query={PUZZLE_COMMENT_AGGREGATE_QUERY}
          variables={{
            puzzleId,
          }}
        >
          {({ error, data }) => {
            if (error) {
              toast.error(error.message);
              return null;
            }
            if (!data || !data.sui_hei_comment_aggregate) return null;
            const agg = {
              commentCount:
                (data.sui_hei_comment_aggregate.aggregate &&
                  data.sui_hei_comment_aggregate.aggregate.count) ||
                0,
            };
            return (
              <>
                <Box width={[1, 1 / 2]} mb={2}>
                  <Box px={2}>
                    <CommentButton
                      width={1}
                      height="4em"
                      borderWidth={2}
                      borderRadius={3}
                      bg="transparent"
                      borderColor="blue.6"
                      borderStyle="solid"
                      onClick={() => setShow(true)}
                    >
                      <Flex alignItems="center" justifyContent="center" p={2}>
                        <Img mr={2} size="xs" src={commentIcon} />
                        <Box fontSize={3} color="blue.6">
                          {agg.commentCount}{' '}
                          <FormattedMessage {...puzzleMessages.comment} />
                        </Box>
                      </Flex>
                    </CommentButton>
                  </Box>
                </Box>
                <Modal show={show} closefn={() => setShow(false)}>
                  <ModalHeader>
                    <FormattedMessage {...puzzleMessages.comment} />
                    <ModalCloseBtn onClick={() => setShow(false)} />
                  </ModalHeader>
                  <Flex flexGrow={1} p={[2, 3]} flexDirection="column">
                    {canAddComment && (
                      <CommentModalAddPanel puzzleId={puzzleId} />
                    )}
                    <CommentModalComments puzzleId={puzzleId} />
                  </Flex>
                </Modal>
              </>
            );
          }}
        </Query>
      )}
    </React.Fragment>
  );
};

export default CommentPanel;