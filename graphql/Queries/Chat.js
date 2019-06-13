import gql from 'graphql-tag';

import { CHATMESSAGE_FRAGMENT, CHATROOM_FRAGMENT } from '../Fragments/Chat';

export const CHATROOM_CHATMESSAGES_QUERY = gql`
  query ChatroomChatmessages($chatroomId: Int, $limit: Int, $offset: Int) {
    sui_hei_chatmessage(
      where: { chatroom_id: { _eq: $chatroomId } }
      limit: $limit
      offset: $offset
      order_by: [{ id: desc }]
    ) @connection(key: "sui_hei_chatmessage", filter: ["where"]) {
      ...Chatmessage
    }
  }
  ${CHATMESSAGE_FRAGMENT}
`;

export const CHATROOM_PUZZLE_QUERY = gql`
  query ChatroomPuzzle($puzzleId: Int!) {
    sui_hei_puzzle_by_pk(id: $puzzleId) {
      id
      anonymous
      sui_hei_user {
        id
      }
    }
  }
`;

export const CHATROOM_ID_QUERY = gql`
  query ChatroomId($chatroomName: String) {
    sui_hei_chatroom(where: { name: { _eq: $chatroomName } }, limit: 1) {
      id
    }
  }
  ${CHATROOM_FRAGMENT}
`;

export const CHATROOM_DESCRIPTION_QUERY = gql`
  query ChatroomDescription($chatroomId: Int!) {
    sui_hei_chatroom_by_pk(id: $chatroomId) {
      ...Chatroom
    }
  }
  ${CHATROOM_FRAGMENT}
`;
