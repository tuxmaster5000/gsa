/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2017 Greenbone Networks GmbH
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

import _ from 'gmp/locale.js';

import PropTypes from '../../utils/proptypes.js';

import DetailsBlock from '../../entity/block.js';
import EntityPage from '../../entity/page.js';
import Note from '../../entity/note.js';
import Override from '../../entity/override.js';
import {withEntityContainer} from '../../entity/container.js';

import SeverityBar from '../../components/bar/severitybar.js';

import ExportIcon from '../../components/icon/exporticon.js';
import HelpIcon from '../../components/icon/helpicon.js';
import Icon from '../../components/icon/icon.js';

import Divider from '../../components/layout/divider.js';
import IconDivider from '../../components/layout/icondivider.js';
import Layout from '../../components/layout/layout.js';

import AssetLink from '../../components/link/assetlink.js';
import DetailsLink from '../../components/link/detailslink.js';
import InnerLink from '../../components/link/innerlink.js';
import LegacyLink from '../../components/link/legacylink.js';

import InfoTable from '../../components/table/info.js';
import TableBody from '../../components/table/body.js';
import TableData from '../../components/table/data.js';
import TableRow from '../../components/table/row.js';

import ResultDetails from './details.js';


const ToolBarIcons = ({
  entity,
  onNewNoteClick,
  onNewOverrideClick
}) => {
  return (
    <Divider margin="10px">
      <IconDivider>
        <HelpIcon
          page="result_details"
          title={_('Help: Result Details')}
        />
        <LegacyLink
          cmd="export_result"
          result_id={entity.id}
        >
          <ExportIcon
            title={_('Export Result as XML')}
          />
        </LegacyLink>
      </IconDivider>
      <IconDivider>
        <Icon
          img="new_note.svg"
          title={_('Add new Note')}
          value={entity}
          onClick={onNewNoteClick}
        />
        <Icon
          img="new_override.svg"
          title={_('Add new Override')}
          value={entity}
          onClick={onNewOverrideClick}
        />
      </IconDivider>
      <IconDivider>
        <DetailsLink
          legacy
          type="task"
          id={entity.task.id}
        >
          <Icon
            img="task.svg"
            title={_('Corresponding Task ({{name}})', entity.task)}
          />
        </DetailsLink>
        <DetailsLink
          legacy
          type="report"
          id={entity.report.id}
        >
          <Icon
            img="report.svg"
            title={_('Corresponding Report')}
          />
        </DetailsLink>
      </IconDivider>
    </Divider>
  );
};

ToolBarIcons.propTypes = {
  entity: PropTypes.model.isRequired,
  onNewNoteClick: PropTypes.func,
  onNewOverrideClick: PropTypes.func,
};

const Details = ({entity, ...props}) => {
  return (
    <Layout flex="column">
      <DetailsBlock
        title={_('Vulnerability')}>
        <InfoTable>
          <TableBody>
            <TableRow>
              <TableData>
                {_('Name')}
              </TableData>
              <TableData>
                {entity.name}
              </TableData>
            </TableRow>
            <TableRow>
              <TableData>
                {_('Severity')}
              </TableData>
              <TableData>
                <Divider>
                  <SeverityBar severity={entity.severity}/>
                  {entity.overrides.active &&
                    <InnerLink
                      to="overrides">
                      <Icon img="override.svg"
                        title={_('Overrides are applied')}
                      />
                    </InnerLink>
                  }
                </Divider>
              </TableData>
            </TableRow>
            <TableRow>
              <TableData>
                {_('QoD')}
              </TableData>
              <TableData>
                {entity.qod.value} %
              </TableData>
            </TableRow>
            <TableRow>
              <TableData>
                {_('Host')}
              </TableData>
              <TableData>
                <AssetLink
                  type="host"
                  id={entity.host.id}>
                  {entity.host.name}
                </AssetLink>
              </TableData>
            </TableRow>
            <TableRow>
              <TableData>
                {_('Location')}
              </TableData>
              <TableData>
                {entity.port}
              </TableData>
            </TableRow>
          </TableBody>
        </InfoTable>
      </DetailsBlock>

      {entity.user_tags.length > 0 &&
        <DetailsBlock
          title={_('Tags')}
        >
          <Divider>
            {entity.user_tags.map(tag => (
              <DetailsLink
                legacy
                key={tag.id}
                id={tag.id}
                type="tag"
              >
                {tag.name + '=' + tag.value}
              </DetailsLink>
            ))}
          </Divider>
        </DetailsBlock>
      }

      <ResultDetails
        entity={entity}
        {...props}
      />

      <DetailsBlock
        id="overrides"
        title={_('Overrides')}>
        <Divider
          wrap
          align={['start', 'stretch']}
          width="15px">
          {
            entity.overrides.filter(override => override.isActive())
              .map(override => (
                <Override
                  key={override.id}
                  override={override}
                />
              ))
          }
        </Divider>
      </DetailsBlock>

      <DetailsBlock
        id="notes"
        title={_('Notes')}>
        <Divider
          wrap
          align={['start', 'stretch']}
          width="15px">
          {
            entity.notes.filter(note => note.isActive())
              .map(note => (
                <Note
                  key={note.id}
                  note={note}
                />
              ))
          }
        </Divider>
      </DetailsBlock>
    </Layout>
  );
};

Details.propTypes = {
  entity: PropTypes.model.isRequired,
};

export default withEntityContainer('result', {
  sectionIcon: 'result.svg',
  title: _('Result'),
  toolBarIcons: ToolBarIcons,
  details: Details,
  permissionsComponent: false,
})(EntityPage);

// vim: set ts=2 sw=2 tw=80:
