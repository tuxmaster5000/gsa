/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2018 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */
import {isDefined} from 'gmp/utils/identity';

import getDashboardSettings from './selectors';
import {
  addDisplayToSettings,
  canAddDisplay,
} from './utils';

export const DASHBOARD_SETTINGS_LOADING_SUCCESS =
  'DASHBOARD_SETTINGS_LOADING_SUCCESS';
export const DASHBOARD_SETTINGS_LOADING_REQUEST =
  'DASHBOARD_SETTINGS_LOADING_REQUEST';
export const DASHBOARD_SETTINGS_LOADING_ERROR =
  'DASHBOARD_SETTINGS_LOADING_ERROR';

export const DASHBOARD_SETTINGS_SAVING_SUCCESS =
  'DASHBOARD_SETTINGS_SAVING_SUCCESS';
export const DASHBOARD_SETTINGS_SAVING_ERROR =
  'DASHBOARD_SETTINGS_SAVING_ERROR';
export const DASHBOARD_SETTINGS_SAVING_REQUEST =
  'DASHBOARD_SETTINGS_SAVING_REQUEST';

export const DASHBOARD_SETTINGS_SET_DEFAULTS =
  'DASHBOARD_SETTINGS_SET_DEFAULTS';

export const DASHBOARD_SETTINGS_RESET_REQUEST =
  'DASHBOARD_SETTINGS_RESET_REQUEST';
export const DASHBOARD_SETTINGS_RESET_SUCCESS =
  'DASHBOARD_SETTINGS_RESET_SUCCESS';
export const DASHBOARD_SETTINGS_RESET_ERROR =
  'DASHBOARD_SETTINGS_RESET_ERROR';

/**
 * Create an action to receive dashboard settings
 *
 * @param {String} id              ID of the dashboard
 * @param {Object} settings        Settings loaded for all dashboards
 * @param {Object} defaultSettings Default settings for the dashboard with the
 *                                 passed ID
 *
 * @returns {Object} The action object
 */
export const receivedDashboardSettings = (id, settings, defaultSettings) => ({
  type: DASHBOARD_SETTINGS_LOADING_SUCCESS,
  id,
  settings,
  defaultSettings,
});

export const receivedDashboardSettingsLoadingError = (id, error) => ({
  type: DASHBOARD_SETTINGS_LOADING_ERROR,
  id,
  error,
});

export const requestDashboardSettings = id => ({
  type: DASHBOARD_SETTINGS_LOADING_REQUEST,
  id,
});

export const saveDashboardSettingsSuccess = id => ({
  type: DASHBOARD_SETTINGS_SAVING_SUCCESS,
  id,
});

export const saveDashboardSettingsError = (id, error) => ({
  type: DASHBOARD_SETTINGS_SAVING_ERROR,
  id,
  error,
});

export const saveDashboardSettingsRequest = (id, settings) => ({
  type: DASHBOARD_SETTINGS_SAVING_REQUEST,
  settings,
  id,
});

export const setDashboardSettingDefaults = (id, defaults) => ({
  type: DASHBOARD_SETTINGS_SET_DEFAULTS,
  id,
  defaults,
});

export const resetDashboardSettingsRequest = (id, settings) => ({
  type: DASHBOARD_SETTINGS_RESET_REQUEST,
  id,
  settings,
});

export const resetDashboardSettingsSuccess = id => ({
  type: DASHBOARD_SETTINGS_RESET_SUCCESS,
  id,
});

export const resetDashboardSettingsError = (id, error) => ({
  type: DASHBOARD_SETTINGS_RESET_ERROR,
  id,
  error,
});

export const loadSettings = gmp => (id, defaults) => (dispatch, getState) => {
  const rootState = getState();
  const settingsSelector = getDashboardSettings(rootState);

  if (settingsSelector.getIsLoading(id)) {
    // we are already loading data
    return Promise.resolve();
  }

  dispatch(requestDashboardSettings(id));

  return gmp.dashboard.getSetting(id).then(
    ({data}) => dispatch(receivedDashboardSettings(id, data, defaults)),
    error => dispatch(receivedDashboardSettingsLoadingError(id, error)),
  );
};

export const saveSettings = gmp => (id, settings) => dispatch => {
  dispatch(saveDashboardSettingsRequest(id, settings));

  return gmp.dashboard.saveSetting(id, settings).then(
    () => dispatch(saveDashboardSettingsSuccess(id)),
    error => dispatch(saveDashboardSettingsError(id, error)),
  );
};

export const resetSettings = gmp => id => (dispatch, getState) => {
  const rootState = getState();
  const settingsSelector = getDashboardSettings(rootState);
  const defaults = settingsSelector.getDefaultsById(id);

  dispatch(resetDashboardSettingsRequest(id, defaults));

  return gmp.dashboard.saveSetting(id, defaults).then(
    () => dispatch(resetDashboardSettingsSuccess(id)),
    error => dispatch(resetDashboardSettingsError(id, error)),
  );
};

export const addDisplay = gmp => (dashboardId, displayId, uuidFunc) =>
  (dispatch, getState) => {

  if (!isDefined(displayId) || !isDefined(dashboardId)) {
    return Promise.resolve();
  }

  const rootState = getState();
  const settingsSelector = getDashboardSettings(rootState);
  const settings = settingsSelector.getById(dashboardId);

  if (!canAddDisplay(settings)) {
    return Promise.resolve();
  }

  const newSettings = addDisplayToSettings(settings, displayId, uuidFunc);

  dispatch(saveDashboardSettingsRequest(dashboardId, newSettings));

  return gmp.dashboard.saveSetting(dashboardId, newSettings).then(
    () => dispatch(saveDashboardSettingsSuccess(dashboardId)),
    error => dispatch(saveDashboardSettingsError(dashboardId, error)),
  );
};

// vim: set ts=2 sw=2 tw=80:
