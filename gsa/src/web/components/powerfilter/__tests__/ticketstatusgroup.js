/* Copyright (C) 2019 Greenbone Networks GmbH
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
import React from 'react';

import {render, fireEvent} from 'web/utils/testing';

import {
  openSelectElement,
  getItemElements,
} from 'web/components/form/__tests__/select';

import TicketStatusGroup from 'web/components/powerfilter/ticketstatusgroup';

import Filter from 'gmp/models/filter';

describe('TicketStatusGroup tests', () => {
  test('should render', () => {
    const filter = Filter.fromString('status=0');
    const handleChange = jest.fn();
    const {element} = render(
      <TicketStatusGroup
        filter={filter}
        name="status"
        onChange={handleChange}
      />,
    );

    expect(element).toMatchSnapshot();
  });

  test('should render value from filter and change it', () => {
    const filter = Filter.fromString('status=0');
    const handleChange = jest.fn();

    // eslint-disable-next-line no-shadow
    const {baseElement, element, getByTestId} = render(
      <TicketStatusGroup
        filter={filter}
        name="status"
        onChange={handleChange}
      />,
    );

    const displayedValue = getByTestId('select-selected-value');
    expect(displayedValue).toHaveTextContent('Open');

    openSelectElement(element);

    const domItems = getItemElements(baseElement);

    fireEvent.click(domItems[2]);

    expect(handleChange).toBeCalled();
    expect(handleChange).toBeCalledWith('2', 'status');
  });
  test('should process title', () => {
    const filter = Filter.fromString('status=0');
    const handleChange = jest.fn();
    const {element} = render(
      <TicketStatusGroup
        filter={filter}
        name="status"
        onChange={handleChange}
      />,
    );

    const input = element.querySelectorAll('label');

    expect(input[0]).toHaveTextContent('Ticket Status');
  });
});
