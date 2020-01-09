import cn from 'classnames';
import {Component} from 'react';
import PropTypes from 'prop-types';

let colors = {
  red: '#f5222d',
  volcano: '#fa541c',
  orange: '#fa8c16',
  gold: '#faad14',
  yellow: '#fadb14',
  lime: '#a0d911',
  green: '#52c41a',
  cyan: '#13c2c2',
  blue: '#1890ff',
  purple: '#722ed1',
  magenta: '#eb2f96',
};

export default class Color extends Component {
  render() {
    const {children, className, type = 'red', ...props} = this.props;

    return (
      <span className={cn('color', className)} {...props}>
        {children}
        <style jsx>{`
          .color{
            color: ${colors[type]};
          }
        `}</style>
      </span>
    );
  }
}

Color.propTypes = {
  type: PropTypes.oneOf([
    'red',
    'volcano',
    'orange',
    'gold',
    'yellow',
    'lime',
    'green',
    'cyan',
    'blue',
    'purple',
    'magenta',
  ]),
};
