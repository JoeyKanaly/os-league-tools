import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from '../store/common';
import { updateAccountCache } from '../store/user/account';

// Basic wrapper around useAuth0 with login state caching for now, more will be added with backend user auth changes
export default function useAccount({ redirectReturnToUrl }) {
  const { isLoading, isAuthenticated, user, loginWithRedirect, logout: logoutWithRedirect } = useAuth0();
  const isLoginCache = useSelector(state => state.account.accountCache.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateAccountCache({ isAuthenticated, user }));
  }, [isAuthenticated]);

  const isLoggedIn = isLoginCache || isAuthenticated;
  const isAuthenticating = isLoading;

  const login = () => {
    loginWithRedirect({ redirect_uri: redirectReturnToUrl });
  };
  const logout = () => {
    logoutWithRedirect({ returnTo: redirectReturnToUrl });
    resetState(dispatch);
  };

  return { isLoggedIn, isAuthenticating, login, logout };
}