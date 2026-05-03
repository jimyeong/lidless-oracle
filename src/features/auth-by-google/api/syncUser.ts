import { gql } from '@apollo/client';

export const SYNC_USER = gql`
    mutation SyncUser{
        syncUser {
            id
            email
            displayName
            photoUrl
            createdAt
        }
    }
`
export const ME = gql`
    query ME{
        me {
            id
            email
            displayName
            photoUrl
            role
        }
    }


`