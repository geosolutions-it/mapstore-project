import React from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect';
import App from '@js/components/App';

describe('App component', () => {
    beforeEach((done) => {
        document.body.innerHTML = '<div id="container"></div>';
        setTimeout(done);
    });
    afterEach((done) => {
        ReactDOM.unmountComponentAtNode(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(done);
    });
    it('should render with default', () => {
        ReactDOM.render(<App />, document.getElementById('container'));
        const container = document.getElementById('container');
        expect(container.querySelector('.ms-app')).toBeTruthy();
    });
});
