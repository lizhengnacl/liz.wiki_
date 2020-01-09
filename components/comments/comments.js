/**
 * https://leancloud.cn/dashboard/data.html?appid=puAKOiHKj1KwOJkXOc5LDUaO-gzGzoHsz
 */

import {Component} from 'react';
import Valine from 'valine';

export default class Comments extends Component {
  componentDidMount() {
    new Valine({
      el: '#vcomments',
      appId: 'puAKOiHKj1KwOJkXOc5LDUaO-gzGzoHsz',
      appKey: 'lUlRiUdBEj5cwhUF4kCxK8cc',
      notify: false,
      verify: false,
      avatar: 'mp',
      placeholder: 'just go go',
    });
  }

  render() {
    const {children, className, type = 'red', ...props} = this.props;

    return (
      <div id='vcomments'>loading...</div>
    );
  }
}
