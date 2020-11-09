import expect from 'expect';
import { extendPluginsDefinition } from '../plugins';

describe('example with plugins', () => {
    it('should show an example of test', () => {
        const plugins = {};
        const requires = {};
        const extendedPlugins = extendPluginsDefinition({ plugins, requires });
        expect(extendedPlugins.plugins).toEqual({});
    });
});
