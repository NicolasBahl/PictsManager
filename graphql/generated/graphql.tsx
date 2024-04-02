import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type Album = {
  __typename?: 'Album';
  accessByUsers: Array<User>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  owner: User;
  photos: Array<Photo>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AlbumOrderBy = {
  size?: InputMaybe<OrderBy>;
  title?: InputMaybe<OrderBy>;
  updatedAt?: InputMaybe<OrderBy>;
};

export enum AlbumPermission {
  CanRead = 'CAN_READ',
  CanWrite = 'CAN_WRITE'
}

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
};

export type CreatePhotoInput = {
  albumId?: InputMaybe<Scalars['ID']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  photo: Scalars['Upload']['input'];
  tags: Array<Scalars['String']['input']>;
};

export type Media = {
  __typename?: 'Media';
  id: Scalars['ID']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAccessUser: Album;
  createAlbum: Album;
  createPhoto: Photo;
  deleteAlbum: Album;
  deletePhoto: Photo;
  deleteUser: User;
  removeAccessUser: Album;
  signIn: AuthPayload;
  signUp: AuthPayload;
  updateAlbum: Album;
  updateTag: Photo;
};


export type MutationAddAccessUserArgs = {
  id: Scalars['ID']['input'];
  userEmail: Scalars['String']['input'];
};


export type MutationCreateAlbumArgs = {
  title: Scalars['String']['input'];
};


export type MutationCreatePhotoArgs = {
  data: CreatePhotoInput;
};


export type MutationDeleteAlbumArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePhotoArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveAccessUserArgs = {
  id: Scalars['ID']['input'];
  userEmail: Scalars['String']['input'];
};


export type MutationSignInArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateAlbumArgs = {
  id: Scalars['ID']['input'];
  permission?: InputMaybe<AlbumPermission>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateTagArgs = {
  id: Scalars['ID']['input'];
  tags: Array<Scalars['String']['input']>;
};

export enum OrderBy {
  Asc = 'Asc',
  Desc = 'Desc'
}

export type Photo = {
  __typename?: 'Photo';
  id: Scalars['ID']['output'];
  media: Media;
  metadata: Scalars['JSON']['output'];
  owner: User;
  tags: Array<Tag>;
};

export type PhotoOrderBy = {
  createdAt?: InputMaybe<OrderBy>;
};

export type Query = {
  __typename?: 'Query';
  album?: Maybe<Album>;
  albums: Array<Album>;
  albumsCount: Scalars['Int']['output'];
  me?: Maybe<User>;
  photos: Array<Photo>;
  photosCount: Scalars['Int']['output'];
};


export type QueryAlbumArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAlbumsArgs = {
  orderBy?: InputMaybe<AlbumOrderBy>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WhereAlbumInput>;
};


export type QueryAlbumsCountArgs = {
  where?: InputMaybe<WhereAlbumInput>;
};


export type QueryPhotosArgs = {
  orderBy?: InputMaybe<PhotoOrderBy>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WherePhotoInput>;
};


export type QueryPhotosCountArgs = {
  where?: InputMaybe<WherePhotoInput>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  albums: Array<Album>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  password: Scalars['String']['output'];
  role: UserRole;
};

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type WhereAlbumInput = {
  isMyAlbum?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type WherePhotoInput = {
  albumId?: InputMaybe<Scalars['ID']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type SignInMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'AuthPayload', token: string } };

export type AddPhotoMutationVariables = Exact<{
  data: CreatePhotoInput;
}>;


export type AddPhotoMutation = { __typename?: 'Mutation', createPhoto: { __typename?: 'Photo', id: string } };

export type AlbumsQueryVariables = Exact<{
  orderBy?: InputMaybe<AlbumOrderBy>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<WhereAlbumInput>;
}>;


export type AlbumsQuery = { __typename?: 'Query', albums: Array<{ __typename?: 'Album', id: string, title: string }> };

export type CurrentAlbumsQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentAlbumsQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, albums: Array<{ __typename?: 'Album', id: string, title: string }> } | null };

export type DeleteAlbumMutationVariables = Exact<{
  albumId: Scalars['ID']['input'];
}>;


export type DeleteAlbumMutation = { __typename?: 'Mutation', deleteAlbum: { __typename?: 'Album', id: string } };

export type DeletePhotoMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeletePhotoMutation = { __typename?: 'Mutation', deletePhoto: { __typename?: 'Photo', id: string } };

export type PhotosQueryVariables = Exact<{
  where?: InputMaybe<WherePhotoInput>;
}>;


export type PhotosQuery = { __typename?: 'Query', photos: Array<{ __typename?: 'Photo', id: string, metadata: any, media: { __typename?: 'Media', id: string, url?: string | null }, tags: Array<{ __typename?: 'Tag', name: string }> }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string } | null };


export const SignInDocument = gql`
    mutation SignIn($email: String!, $password: String!) {
  signIn(email: $email, password: $password) {
    token
  }
}
    `;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const AddPhotoDocument = gql`
    mutation AddPhoto($data: CreatePhotoInput!) {
  createPhoto(data: $data) {
    id
  }
}
    `;
export type AddPhotoMutationFn = Apollo.MutationFunction<AddPhotoMutation, AddPhotoMutationVariables>;

/**
 * __useAddPhotoMutation__
 *
 * To run a mutation, you first call `useAddPhotoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPhotoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPhotoMutation, { data, loading, error }] = useAddPhotoMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAddPhotoMutation(baseOptions?: Apollo.MutationHookOptions<AddPhotoMutation, AddPhotoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPhotoMutation, AddPhotoMutationVariables>(AddPhotoDocument, options);
      }
export type AddPhotoMutationHookResult = ReturnType<typeof useAddPhotoMutation>;
export type AddPhotoMutationResult = Apollo.MutationResult<AddPhotoMutation>;
export type AddPhotoMutationOptions = Apollo.BaseMutationOptions<AddPhotoMutation, AddPhotoMutationVariables>;
export const AlbumsDocument = gql`
    query Albums($orderBy: AlbumOrderBy, $skip: Int, $take: Int, $where: WhereAlbumInput) {
  albums(orderBy: $orderBy, skip: $skip, take: $take, where: $where) {
    id
    title
  }
}
    `;

/**
 * __useAlbumsQuery__
 *
 * To run a query within a React component, call `useAlbumsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAlbumsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAlbumsQuery({
 *   variables: {
 *      orderBy: // value for 'orderBy'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useAlbumsQuery(baseOptions?: Apollo.QueryHookOptions<AlbumsQuery, AlbumsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AlbumsQuery, AlbumsQueryVariables>(AlbumsDocument, options);
      }
export function useAlbumsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AlbumsQuery, AlbumsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AlbumsQuery, AlbumsQueryVariables>(AlbumsDocument, options);
        }
export function useAlbumsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<AlbumsQuery, AlbumsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AlbumsQuery, AlbumsQueryVariables>(AlbumsDocument, options);
        }
export type AlbumsQueryHookResult = ReturnType<typeof useAlbumsQuery>;
export type AlbumsLazyQueryHookResult = ReturnType<typeof useAlbumsLazyQuery>;
export type AlbumsSuspenseQueryHookResult = ReturnType<typeof useAlbumsSuspenseQuery>;
export type AlbumsQueryResult = Apollo.QueryResult<AlbumsQuery, AlbumsQueryVariables>;
export const CurrentAlbumsDocument = gql`
    query CurrentAlbums {
  me {
    id
    albums {
      id
      title
    }
  }
}
    `;

/**
 * __useCurrentAlbumsQuery__
 *
 * To run a query within a React component, call `useCurrentAlbumsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentAlbumsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentAlbumsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentAlbumsQuery(baseOptions?: Apollo.QueryHookOptions<CurrentAlbumsQuery, CurrentAlbumsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentAlbumsQuery, CurrentAlbumsQueryVariables>(CurrentAlbumsDocument, options);
      }
export function useCurrentAlbumsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentAlbumsQuery, CurrentAlbumsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentAlbumsQuery, CurrentAlbumsQueryVariables>(CurrentAlbumsDocument, options);
        }
export function useCurrentAlbumsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CurrentAlbumsQuery, CurrentAlbumsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CurrentAlbumsQuery, CurrentAlbumsQueryVariables>(CurrentAlbumsDocument, options);
        }
export type CurrentAlbumsQueryHookResult = ReturnType<typeof useCurrentAlbumsQuery>;
export type CurrentAlbumsLazyQueryHookResult = ReturnType<typeof useCurrentAlbumsLazyQuery>;
export type CurrentAlbumsSuspenseQueryHookResult = ReturnType<typeof useCurrentAlbumsSuspenseQuery>;
export type CurrentAlbumsQueryResult = Apollo.QueryResult<CurrentAlbumsQuery, CurrentAlbumsQueryVariables>;
export const DeleteAlbumDocument = gql`
    mutation DeleteAlbum($albumId: ID!) {
  deleteAlbum(id: $albumId) {
    id
  }
}
    `;
export type DeleteAlbumMutationFn = Apollo.MutationFunction<DeleteAlbumMutation, DeleteAlbumMutationVariables>;

/**
 * __useDeleteAlbumMutation__
 *
 * To run a mutation, you first call `useDeleteAlbumMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAlbumMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAlbumMutation, { data, loading, error }] = useDeleteAlbumMutation({
 *   variables: {
 *      albumId: // value for 'albumId'
 *   },
 * });
 */
export function useDeleteAlbumMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAlbumMutation, DeleteAlbumMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAlbumMutation, DeleteAlbumMutationVariables>(DeleteAlbumDocument, options);
      }
export type DeleteAlbumMutationHookResult = ReturnType<typeof useDeleteAlbumMutation>;
export type DeleteAlbumMutationResult = Apollo.MutationResult<DeleteAlbumMutation>;
export type DeleteAlbumMutationOptions = Apollo.BaseMutationOptions<DeleteAlbumMutation, DeleteAlbumMutationVariables>;
export const DeletePhotoDocument = gql`
    mutation DeletePhoto($id: String!) {
  deletePhoto(id: $id) {
    id
  }
}
    `;
export type DeletePhotoMutationFn = Apollo.MutationFunction<DeletePhotoMutation, DeletePhotoMutationVariables>;

/**
 * __useDeletePhotoMutation__
 *
 * To run a mutation, you first call `useDeletePhotoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePhotoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePhotoMutation, { data, loading, error }] = useDeletePhotoMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePhotoMutation(baseOptions?: Apollo.MutationHookOptions<DeletePhotoMutation, DeletePhotoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePhotoMutation, DeletePhotoMutationVariables>(DeletePhotoDocument, options);
      }
export type DeletePhotoMutationHookResult = ReturnType<typeof useDeletePhotoMutation>;
export type DeletePhotoMutationResult = Apollo.MutationResult<DeletePhotoMutation>;
export type DeletePhotoMutationOptions = Apollo.BaseMutationOptions<DeletePhotoMutation, DeletePhotoMutationVariables>;
export const PhotosDocument = gql`
    query Photos($where: WherePhotoInput) {
  photos(where: $where) {
    id
    media {
      id
      url
    }
    metadata
    tags {
      name
    }
  }
}
    `;

/**
 * __usePhotosQuery__
 *
 * To run a query within a React component, call `usePhotosQuery` and pass it any options that fit your needs.
 * When your component renders, `usePhotosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePhotosQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function usePhotosQuery(baseOptions?: Apollo.QueryHookOptions<PhotosQuery, PhotosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PhotosQuery, PhotosQueryVariables>(PhotosDocument, options);
      }
export function usePhotosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PhotosQuery, PhotosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PhotosQuery, PhotosQueryVariables>(PhotosDocument, options);
        }
export function usePhotosSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PhotosQuery, PhotosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PhotosQuery, PhotosQueryVariables>(PhotosDocument, options);
        }
export type PhotosQueryHookResult = ReturnType<typeof usePhotosQuery>;
export type PhotosLazyQueryHookResult = ReturnType<typeof usePhotosLazyQuery>;
export type PhotosSuspenseQueryHookResult = ReturnType<typeof usePhotosSuspenseQuery>;
export type PhotosQueryResult = Apollo.QueryResult<PhotosQuery, PhotosQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;