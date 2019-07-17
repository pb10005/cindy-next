import React, { useRef, useState, useEffect } from 'react';
import { upsertItem } from 'common/update';
import { toast } from 'react-toastify';

import { connect } from 'react-redux';
import * as globalReducer from 'reducers/global';

import { Query, Mutation, QueryResult } from 'react-apollo';
import {
  PREVIOUS_COMMENT_VALUE_QUERY,
  PUZZLE_COMMENT_QUERY,
} from 'graphql/Queries/Comment';
import { ADD_COMMENT_MUTATION } from 'graphql/Mutations/Comment';

import Flex from 'components/General/Flex';
import Box from 'components/General/Box';
import Textarea from 'components/General/Textarea';
import ButtonTransparent from 'components/General/ButtonTransparent';
import { Switch } from 'components/General/Switch';

import { FormattedMessage } from 'react-intl';
import puzzleMessages from 'messages/components/puzzle';
import commonMessages from 'messages/common';

import { CommentModalAddPanelProps } from './types';
import {
  PreviousCommentValueQuery,
  PreviousCommentValueQueryVariables,
} from 'graphql/Queries/generated/PreviousCommentValueQuery';
import {
  AddCommentMutationVariables,
  AddCommentMutation,
} from 'graphql/Mutations/generated/AddCommentMutation';
import { StateType } from 'reducers/types';
import {
  PuzzleCommentQuery,
  PuzzleCommentQueryVariables,
} from 'graphql/Queries/generated/PuzzleCommentQuery';
import { ApolloError } from 'apollo-client';

const CommentModalAddPanelRenderer = ({
  puzzleId,
  user,
  data,
  error,
}: CommentModalAddPanelProps &
  QueryResult<
    PreviousCommentValueQuery,
    PreviousCommentValueQueryVariables
  >) => {
  const [spoiler, setSpoiler] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null!);
  const notifHdlRef = useRef<React.ReactText | null>(null);

  useEffect(() => {
    if (!data || !data.sui_hei_comment || data.sui_hei_comment.length === 0)
      return;
    setSpoiler(data.sui_hei_comment[0].spoiler);
    if (inputRef.current)
      inputRef.current.value = data.sui_hei_comment[0].content;
  }, [data]);

  if (error) {
    toast.error(error.message);
    return null;
  }
  if (!data || !data.sui_hei_comment) return null;

  return (
    <Flex
      flexGrow={1}
      flexWrap="wrap"
      border="3px solid"
      borderRadius={1}
      borderColor="yellow.4"
      bg="yellow.2"
      mb={2}
    >
      <Box bg="yellow.3" width={1} p={2} mb={2}>
        {data.sui_hei_comment.length === 0 ? (
          <FormattedMessage {...puzzleMessages.addComment} />
        ) : (
          <FormattedMessage {...puzzleMessages.yourComment} />
        )}
      </Box>
      <Flex width={1} mb={1} alignItems="center">
        <Box minWidth="6em" px={1}>
          <FormattedMessage {...puzzleMessages.comment} />
        </Box>
        <Box style={{ flexGrow: 1 }}>
          <Textarea
            bg="yellow.1"
            p="2px"
            minWidth="calc(100% - 6px)"
            border="2px solid"
            borderColor="yellow.4"
            ref={inputRef}
          />
        </Box>
      </Flex>
      <Box width={1} mb={1}>
        <Switch selected={spoiler} onClick={() => setSpoiler(!spoiler)} />
        <FormattedMessage {...puzzleMessages.spoiler} />
      </Box>
      <Box width={1} bg="yellow.4">
        <Mutation<AddCommentMutation, AddCommentMutationVariables>
          mutation={ADD_COMMENT_MUTATION}
          update={(proxy, { data }) => {
            if (
              !data ||
              !data.insert_sui_hei_comment ||
              data.insert_sui_hei_comment.returning.length === 0
            )
              return;
            const newComment = data.insert_sui_hei_comment.returning[0];

            // Update comment list
            const oldComments = proxy.readQuery<
              PuzzleCommentQuery,
              PuzzleCommentQueryVariables
            >({
              query: PUZZLE_COMMENT_QUERY,
              variables: {
                puzzleId,
              },
            });
            if (oldComments) {
              proxy.writeQuery<PuzzleCommentQuery, PuzzleCommentQueryVariables>(
                {
                  query: PUZZLE_COMMENT_QUERY,
                  variables: {
                    puzzleId,
                  },
                  data: {
                    ...oldComments,
                    sui_hei_comment:
                      newComment.id === -1
                        ? [newComment, ...oldComments.sui_hei_comment]
                        : upsertItem(
                            oldComments.sui_hei_comment,
                            newComment,
                            'id',
                            'desc',
                          ),
                  },
                },
              );
            }

            // Update user comment
            if (!user.id) return;
            proxy.writeQuery<
              PreviousCommentValueQuery,
              PreviousCommentValueQueryVariables
            >({
              query: PREVIOUS_COMMENT_VALUE_QUERY,
              variables: {
                puzzleId,
                userId: user.id,
              },
              data: {
                sui_hei_comment: [newComment],
              },
            });
          }}
        >
          {addComment => (
            <ButtonTransparent
              p={2}
              width={1}
              onClick={() => {
                if (!inputRef.current) return;
                const content = inputRef.current.value.trim();
                addComment({
                  variables: {
                    puzzleId,
                    content,
                    spoiler,
                  },
                  optimisticResponse: {
                    insert_sui_hei_comment: {
                      __typename: 'sui_hei_comment_mutation_response',
                      returning: [
                        {
                          __typename: 'sui_hei_comment',
                          id:
                            data.sui_hei_comment.length > 0
                              ? data.sui_hei_comment[0].id
                              : -1,
                          content,
                          spoiler,
                          sui_hei_user: {
                            __typename: 'sui_hei_user',
                            id: user.id || -1,
                            sui_hei_current_useraward: null,
                            nickname: user.nickname || '...',
                            username: user.username || '...',
                          },
                        },
                      ],
                    },
                  },
                })
                  .then(res => {
                    if (!res) return;
                    const { errors } = res;
                    if (errors) {
                      toast.error(JSON.stringify(errors));
                      setSpoiler(spoiler);
                      return;
                    }
                    if (notifHdlRef.current) toast.dismiss(notifHdlRef.current);
                    toast.info(<FormattedMessage {...commonMessages.saved} />);
                  })
                  .catch((e: ApolloError) => {
                    if (notifHdlRef.current) toast.dismiss(notifHdlRef.current);
                    toast.error(e.message);
                  });

                notifHdlRef.current = toast.info(
                  <FormattedMessage {...commonMessages.saving} />,
                );
              }}
            >
              {data.sui_hei_comment.length === 0 ? (
                <FormattedMessage {...commonMessages.send} />
              ) : (
                <FormattedMessage {...commonMessages.save} />
              )}
            </ButtonTransparent>
          )}
        </Mutation>
      </Box>
    </Flex>
  );
};

const CommentModalAddPanel = ({
  puzzleId,
  user,
}: CommentModalAddPanelProps) => {
  return user.id ? (
    <Query<PreviousCommentValueQuery, PreviousCommentValueQueryVariables>
      query={PREVIOUS_COMMENT_VALUE_QUERY}
      variables={{
        puzzleId,
        userId: user.id,
      }}
    >
      {params => (
        <CommentModalAddPanelRenderer
          puzzleId={puzzleId}
          user={user}
          {...params}
        />
      )}
    </Query>
  ) : null;
};

const mapStateToProps = (state: StateType) => ({
  user: globalReducer.rootSelector(state).user,
});

const withRedux = connect(mapStateToProps);

export default withRedux(CommentModalAddPanel);