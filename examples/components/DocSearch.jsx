/**
 * @file 实现前端文档搜索
 */
import React from 'react';
import Axios from 'axios';
import SearchBox from '../../src/components/SearchBox';

let ContextPath = '';

if (process.env.NODE_ENV === 'production') {
  ContextPath = '/amis';
}

export default class DocSearch extends React.Component {
  docs = [];
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      loadError: false
    };
    this.onSearch = this.onSearch.bind(this);
    this.onSearchCancel = this.onSearchCancel.bind(this);
  }
  componentDidMount() {
    Axios.get(__uri('../docs.json'))
      .then(result => {
        this.docs = result.data.docs;
      })
      .catch(err => {
        this.setState({loadError: true});
      });
  }

  onSearch(query) {
    query = query.trim().toLowerCase();
    if (query === '') {
      this.setState({searchResults: []});
      return;
    }
    let results = [];
    for (let doc of this.docs) {
      let index = doc.body.indexOf(query);

      if (index !== -1) {
        results.push({
          title: doc.title,
          path: doc.path,
          abstract: doc.body
            .substring(Math.max(0, index - 20), index + 60)
            .replace(query, `<strong>${query}</strong>`)
        });
      } else if (doc.title.toLowerCase().indexOf(query) !== -1) {
        results.push({
          title: doc.title,
          path: doc.path,
          abstract: ''
        });
      } else if (doc.path.toLowerCase().indexOf(query) !== -1) {
        results.push({
          title: doc.title,
          path: doc.path,
          abstract: ''
        });
      }
    }
    this.setState({searchResults: results});
  }

  onSearchCancel() {
    this.setState({searchResults: []});
  }

  render() {
    const searchResults = this.state.searchResults;
    return (
      <div className="p-r">
        <SearchBox onSearch={this.onSearch} onCancel={this.onSearchCancel} />
        {searchResults.length > 0 ? (
          <div className="search-result">
            {searchResults.map(item => {
              return (
                <a href={ContextPath + item.path} key={`list_${item.path}`}>
                  <h5>{item.title}</h5>
                  <p dangerouslySetInnerHTML={{__html: item.abstract}} />
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}
