import {shallowMount} from '@vue/test-utils'
import ItemList from '../ItemList'
import Item from '../../components/ItemComponent'
import flushPromises from 'flush-promises'
import { fetchListData } from '../../api/api'   

// tell jest to use the created mock api file
jest.mock('../../api/api.js')


describe('ItemList.vue', () => {
    test('calls $bar start on load', () => {
        const $bar = {
            start: jest.fn(),
            finish: () => {}
        }

        shallowMount(ItemList, {
            mocks: {$bar}
        })

        expect($bar.start).toHaveBeenCalledTimes(1)
    })

    test('renders an Item with data for each item', async() => {
        expect.assertions(4)
        const $bar = {
            start: () => {},
            finish: () => {}
        }

        const items = [{id:1},{id:2},{id:3}]
        fetchListData.mockResolvedValueOnce(items)

        const wrapper = shallowMount(ItemList, {mocks: {$bar}})

        await flushPromises()
        const Items = wrapper.findAllComponents(Item)
        expect(Items).toHaveLength(items.length)

        Items.wrappers.forEach((wrapper, i) => {
            expect(wrapper.vm.item).toBe(items[i])
        })
    })

    test('calls $bar.finish when load is successful', async() => {
        expect.assertions(1)

        const $bar = {
            start: () => {},
            finish: jest.fn()
        }

        shallowMount(ItemList, {mocks: {$bar}})
        await flushPromises()
        expect($bar.finish).toHaveBeenCalled()
    })

    test('calls $bar.fail when load is unsuccessful', async()=> {
        expect.assertions(1)

        const $bar = {
            start: () => {},
            fail: jest.fn()
        }
        fetchListData.mockRejectedValueOnce()
        shallowMount(ItemList, {
            mocks: {$bar}
        })
        await flushPromises()
        expect($bar.fail).toHaveBeenCalled()
    })
})