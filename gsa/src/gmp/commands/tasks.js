/* Copyright (C) 2016-2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
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
import logger from '../log';

import registerCommand from '../command';

import {NO_VALUE} from '../parser';

import Task, {HOSTS_ORDERING_SEQUENTIAL} from '../models/task';

import EntitiesCommand from './entities';
import EntityCommand from './entity';

const log = logger.getLogger('gmp.commands.tasks');

export class TaskCommand extends EntityCommand {
  constructor(http) {
    super(http, 'task', Task);
  }

  start({id}) {
    log.debug('Starting task...');

    return this.httpPost({
      cmd: 'start_task',
      id,
    })
      .then(() => {
        log.debug('Started task');
        return this.get({id});
      })
      .catch(err => {
        log.error('An error occurred while starting the task', id, err);
        throw err;
      });
  }

  stop({id}) {
    log.debug('Stopping task');

    return this.httpPost({
      cmd: 'stop_task',
      id,
    })
      .then(() => {
        log.debug('Stopped task');
        return this.get({id});
      })
      .catch(err => {
        log.error('An error occurred while stopping the task', id, err);
        throw err;
      });
  }

  resume({id}) {
    return this.httpPost({
      cmd: 'resume_task',
      id,
    })
      .then(() => {
        log.debug('Resumed task');
        return this.get({id});
      })
      .catch(err => {
        log.error('An error occurred while resuming the task', id, err);
        throw err;
      });
  }

  create(args) {
    const {
      add_tag,
      alert_ids = [],
      alterable,
      apply_overrides,
      auto_delete,
      auto_delete_data,
      comment = '',
      config_id,
      hosts_ordering,
      in_assets,
      max_checks,
      max_hosts,
      min_qod,
      name,
      scanner_type,
      scanner_id,
      schedule_id,
      schedule_periods,
      source_iface,
      tag_id,
      target_id,
    } = args;

    const data = {
      cmd: 'create_task',
      add_tag,
      'alert_ids:': alert_ids,
      alterable,
      apply_overrides,
      auto_delete,
      auto_delete_data,
      comment,
      config_id,
      hosts_ordering,
      in_assets,
      max_checks,
      max_hosts,
      min_qod,
      name,
      scanner_id,
      scanner_type,
      schedule_id,
      schedule_periods,
      source_iface,
      tag_id,
      target_id,
      usage_type: 'scan',
    };
    log.debug('Creating task', args, data);
    return this.action(data);
  }

  createContainer(args) {
    const {name, comment = ''} = args;
    log.debug('Creating container task', args);
    return this.action({
      cmd: 'create_container_task',
      name,
      comment,
    });
  }

  save(args) {
    const {
      alert_ids = [],
      alterable,
      auto_delete,
      auto_delete_data,
      apply_overrides,
      comment = '',
      config_id = NO_VALUE,
      hosts_ordering = HOSTS_ORDERING_SEQUENTIAL,
      id,
      in_assets,
      max_checks,
      max_hosts,
      min_qod,
      name,
      scanner_id = NO_VALUE,
      scanner_type,
      schedule_id = NO_VALUE,
      schedule_periods,
      target_id = NO_VALUE,
      source_iface,
    } = args;
    const data = {
      alterable,
      'alert_ids:': alert_ids,
      apply_overrides,
      auto_delete,
      auto_delete_data,
      comment,
      config_id,
      cmd: 'save_task',
      hosts_ordering,
      in_assets,
      max_checks,
      max_hosts,
      min_qod,
      name,
      scanner_id,
      scanner_type,
      schedule_id,
      schedule_periods,
      source_iface,
      target_id,
      task_id: id,
    };
    log.debug('Saving task', args, data);
    return this.action(data);
  }

  saveContainer(args) {
    const {
      name,
      comment = '',
      in_assets = '1',
      auto_delete = 'no',
      auto_delete_data,
      id,
    } = args;
    log.debug('Saving container task', args);
    return this.action({
      cmd: 'save_container_task',
      name,
      comment,
      in_assets,
      auto_delete,
      auto_delete_data,
      task_id: id,
    });
  }

  getElementFromRoot(root) {
    return root.get_task.get_tasks_response.task;
  }
}

class TasksCommand extends EntitiesCommand {
  constructor(http) {
    super(http, 'task', Task);
  }

  getEntitiesResponse(root) {
    return root.get_tasks.get_tasks_response;
  }

  getSeverityAggregates({filter} = {}) {
    return this.getAggregates({
      aggregate_type: 'task',
      group_column: 'severity',
      filter,
    });
  }

  getStatusAggregates({filter} = {}) {
    return this.getAggregates({
      aggregate_type: 'task',
      group_column: 'status',
      filter,
    });
  }

  getHighResultsAggregates({filter, max} = {}) {
    return this.getAggregates({
      filter,
      aggregate_type: 'task',
      group_column: 'uuid',
      textColumns: ['name', 'high_per_host', 'severity', 'modified'],
      sort: [
        {
          field: 'high_per_host',
          direction: 'descending',
          stat: 'max',
        },
        {
          field: 'modified',
          direction: 'descending',
        },
      ],
      maxGroups: max,
    });
  }
}

registerCommand('task', TaskCommand);
registerCommand('tasks', TasksCommand);

// vim: set ts=2 sw=2 tw=80:
