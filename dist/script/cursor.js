let cursor = document.querySelector('.martelo')
document.addEventListener('mousemove', () => {
	cursor.style.top = event.clientY + 'px'
	cursor.style.left = event.clientX + 'px'
})
