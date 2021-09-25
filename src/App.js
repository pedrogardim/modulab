import "./App.css";

import React, { useState, useEffect, Fragment, useRef } from "react";
import { Helmet } from "react-helmet";

import { Switch, Route, withRouter, useHistory } from "react-router-dom";

import {
  Icon,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Toolbar,
  AppBar,
  Typography,
  Fade,
} from "@material-ui/core";

import * as Tone from "tone";

import firebase from "firebase";
import { useTranslation } from "react-i18next";

import Workspace from "./components/ui/Workspace";

import AppLogo from "./components/ui/AppLogo";

//import AuthDialog from "./components/ui/Dialogs/AuthDialog";

import ActionConfirm from "./components/ui/Dialogs/ActionConfirm";

//import { createNewSession } from "./utils/sessionUtils";

function App() {
  const { t, i18n } = useTranslation();
  const history = useHistory();

  const wrapperRef = useRef(null);

  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [authDialog, setAuthDialog] = useState(false);
  const [userOption, setUserOption] = useState(false);
  const [languagePicker, setLanguagePicker] = useState(false);

  const [sideMenu, setSideMenu] = useState(false);
  const [openedSession, setOpenedSession] = useState(null);

  const [currentRoute, setCurrentRoute] = useState(null);

  const [followingRoute, setFollowingRoute] = useState(null);

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  /* const handlePageNav = (route, id, newTab) => {
    if (newTab && !window.cordova) {
      const win = window.open(`/#/${route}/${id}`, "_blank");
      win.focus();
    } else {
      if (unsavedChanges && !followingRoute) {
        setFollowingRoute([route, id, newTab]);
        return;
      }

      history.push(id ? `/${route}/${id}` : `/${route}`);
      setUnsavedChanges(false);
    }
    setCurrentRoute(route);
    setFollowingRoute(null);
  }; */

  const handleCreateNewSession = (session) => {
    //createNewSession(session, handlePageNav, setOpenedSession);
  };

  useEffect(() => {
    window.onbeforeunload = function (e) {
      if (!unsavedChanges) return;
      var dialogText = "Dialog text here";
      e.returnValue = dialogText;
      return dialogText;
    };
  }, [unsavedChanges]);

  return (
    <Fragment>
      {/* <Fade in={!isOnline}>
        <div className="app-offline-screen">
          <AppLogo
            style={{ marginBottom: 32 }}
            className="loading-screen-logo"
            animated
          />
          <Typography align="center" variant="h5" style={{ padding: 64 }}>
            {t("misc.offlineAlert")}
          </Typography>
        </div>
      </Fade> */}
      {/* <AppBar position="sticky">
        <Toolbar className="app-bar">
          <IconButton
            className="side-menu-icon"
            onClick={() => setSideMenu(true)}
          >
            <Icon>menu</Icon>
          </IconButton>
          <div className="app-logo-header">
            <AppLogo style={{ height: 30 }} src={logo} />
            <Typography variant="overline" className="app-log-beta-mark">
              BETA
            </Typography>
          </div>
          <IconButton
            style={{ position: "absolute", right: 80 }}
            onClick={(e) => setLanguagePicker(e.currentTarget)}
          >
            <Icon style={{ color: "white" }}>language</Icon>
          </IconButton>
          <IconButton className="main-avatar" onClick={handleAvatarClick}>
            <Avatar
              alt={user && user.displayName}
              src={user && user.photoURL && user.photoURL}
            />
          </IconButton>
        </Toolbar>
        {currentRoute && (
          <Helmet>
            <title>MusaBeat - {pageLabels[currentRoute] || "Home"}</title>
          </Helmet>
        )}
      </AppBar> */}
      <div className="app-wrapper" onMouseDown={() => Tone.start()}>
        {/* <Menu
          style={{ marginTop: 48 }}
          anchorEl={languagePicker}
          keepMounted
          open={!!languagePicker}
          onClose={() => setLanguagePicker(false)}
        >
          <MenuItem onClick={() => handleLanguageChange("en")}>
            English
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange("es")}>
            Español
          </MenuItem>
        </Menu> */}

        <Switch>
          <Route exact path="/">
            <Workspace
              user={user}
              setAuthDialog={setAuthDialog}
              createNewSession={handleCreateNewSession}
            />
          </Route>
        </Switch>
      </div>
      {/* <ActionConfirm
        unsavedChanges
        open={Boolean(followingRoute)}
        onClose={() => setFollowingRoute(null)}
        action={() => handlePageNav(...followingRoute)}
      /> */}
    </Fragment>
  );
}

export default withRouter(App);
