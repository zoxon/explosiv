const { test } = require('uvu')
const assert = require('uvu/assert')
const Explosiv = require('../src/jsx-runtime.js')

test('process JSX fragments by returning their children', () => {
	assert.equal(
		(
			<div>
				<p>Hello fragments!</p>
				<>
					<p>
						<small>just another item</small>
					</p>
					<p>helo</p>
					<div>
						<p>What about even more nesting</p>
						<>
							<span>Hello! I'm very deeply nested</span>
						</>
					</div>
				</>
			</div>
		).toString(),
		`<div><p>Hello fragments!</p><p><small>just another item</small></p><p>helo</p><div><p>What about even more nesting</p><span>Hello! I'm very deeply nested</span></div></div>`
	)
})

test('set InnerHTML of a node using the `html` prop', () => {
	assert.equal(
		(
			<div html={`<p>Hello there!</p><h3>This is pretty neat!</h3>`}></div>
		).toString(),
		`<div><p>Hello there!</p><h3>This is pretty neat!</h3></div>`
	)
})

test('translates `style` prop to a string if set as an object', () => {
	let myColor = 'red'

	assert.equal(
		(
			<div style={{ color: myColor, backgroundColor: 'red' }}>
				<p style="color: green;">I have regular styling</p>
			</div>
		).toString(),
		`<div style="color:${myColor};background-color:red"><p style="color: green;">I have regular styling</p></div>`
	)
})

test.run()
