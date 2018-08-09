/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2016 - 2018 Greenbone Networks GmbH
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

import React from 'react';

import {withRouter} from 'react-router-dom';

import styled from 'styled-components';

import _ from 'gmp/locale';

import GBIcon from 'web/components/icon/greenboneicon';
import Icon from 'web/components/icon/icon';

import Divider from 'web/components/layout/divider';
import Layout from 'web/components/layout/layout';

import Link from 'web/components/link/link';

import compose from 'web/utils/compose';
import PropTypes from 'web/utils/proptypes';
import Theme from 'web/utils/theme';
import withGmp from 'web/utils/withGmp';
import withUsername from 'web/utils/withUserName';

const TITLE_BAR_HEIGHT = '42px';

const LogoutLink = styled.a`
  color: ${Theme.darkGray};
  cursor: pointer;
  &:link, &:hover, &:active, &:visited{
    color: ${Theme.darkGray};
  };
`;

const UserLink = LogoutLink.withComponent(Link);

const GreenboneIcon = styled(GBIcon)`
  width: 40px;
  height: 40px;
  margin-right: 4px;
  margin-top: 1px;
  margin-bottom: 1px;
`;

const GsaIconComponent = props => (
  <Icon
    {...props}
    img="gsa.svg"
    size="default"
    alt={_('Greenbone Security Assistant')}
  />
);

const GsaIcon = styled(GsaIconComponent)`
  height: 40px;
  padding-top: 1px;
  padding-bottom: 1px;
`;

const Greenbone = () => (
  <Layout>
    <GreenboneIcon/>
    <GsaIcon/>
  </Layout>
);

const TitlebarLayout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${TITLE_BAR_HEIGHT};
  background-color: ${Theme.green};
  padding: 0px 5px 0px 5px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${Theme.Layers.menu};
`;

const TitlebarPlaceholder = styled.div`
  height: ${TITLE_BAR_HEIGHT}
`;

class Titlebar extends React.Component {

  constructor(...args) {
    super(...args);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(event) {
    const {gmp, history} = this.props;

    event.preventDefault();

    gmp.logout().then(() => {
      history.push('/login?type=logout');
    });
  }


  render() {
    const {
      gmp,
      username,
    } = this.props;
    return (
      <React.Fragment>
        <TitlebarPlaceholder/>
        <TitlebarLayout>
          {gmp.isLoggedIn() &&
            <Link
              to="/"
              title={_('Dashboard')}
            >
              <Greenbone/>
            </Link>
          }
          {gmp.isLoggedIn() ?
            <Divider>
              <span>{_('Logged in as ')}</span>
              <UserLink to="usersettings">
                <b>{username}</b>
              </UserLink>
              <span> | </span>
              <LogoutLink onClick={this.handleLogout}>{_('Logout')}</LogoutLink>
            </Divider> :
            <Greenbone/>
          }
        </TitlebarLayout>
      </React.Fragment>
    );
  }
}

Titlebar.propTypes = {
  gmp: PropTypes.gmp.isRequired,
  history: PropTypes.object.isRequired,
  username: PropTypes.string,
};

export default compose(
  withGmp,
  withRouter,
  withUsername,
)(Titlebar);

// vim: set ts=2 sw=2 tw=80:
