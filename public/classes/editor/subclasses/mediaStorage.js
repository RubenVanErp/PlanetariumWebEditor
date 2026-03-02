export class MediaStorage {
	constructor(editor) {
        this.editor = editor
		this.items = [];
		this.uploadModal = null;
		this.pickerModal = null;
	}

	getAll() {
		return [...this.items];
	}

	addFiles(fileList) {
		const files = Array.from(fileList || []);
		files.forEach((file) => {
			if (!file || !file.type) {
				return;
			}
			const kind = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'other';
			if (kind === 'other') {
				return;
			}
			const url = URL.createObjectURL(file);
			const item = {
				id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
				name: file.name,
				type: file.type,
				size: file.size,
				kind,
				file,
				url
			};
			this.items.push(item);
		});
	}

	removeById(id) {
		const index = this.items.findIndex((item) => item.id === id);
		if (index === -1) {
			return;
		}
		const [removed] = this.items.splice(index, 1);
		if (removed?.url) {
			URL.revokeObjectURL(removed.url);
		}
	}

	clear() {
		this.items.forEach((item) => {
			if (item?.url) {
				URL.revokeObjectURL(item.url);
			}
		});
		this.items = [];
	}

	openUploadDialog({ title = 'Upload Media', onComplete } = {}) {
		this.closeUploadDialog();
		const modal = this.createModalShell(title);
		const content = modal.querySelector('.media-storage-content');

		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*,video/*';
		input.multiple = true;

		const info = document.createElement('div');
		info.textContent = 'Select images or videos to add.';
		info.style.margin = '8px 0';

		const actions = document.createElement('div');
		actions.style.display = 'flex';
		actions.style.gap = '8px';
		actions.style.justifyContent = 'flex-end';

		const cancel = document.createElement('button');
		cancel.textContent = 'Close';
		cancel.addEventListener('click', () => this.closeUploadDialog());

		const add = document.createElement('button');
		add.textContent = 'Add';
		add.addEventListener('click', () => {
			this.addFiles(input.files);
			if (onComplete) {
				onComplete(this.getAll());
			}
			this.closeUploadDialog();
		});

		actions.appendChild(cancel);
		actions.appendChild(add);
		content.appendChild(info);
		content.appendChild(input);
		content.appendChild(actions);

		document.body.appendChild(modal);
		this.uploadModal = modal;
	}

	closeUploadDialog() {
		if (this.uploadModal) {
			this.uploadModal.remove();
			this.uploadModal = null;
		}
	}

	openPickerDialog({ title = 'Select Media', onSelect, allowRemove = true } = {}) {
		this.closePickerDialog();
		const modal = this.createModalShell(title);
		const content = modal.querySelector('.media-storage-content');

		const list = document.createElement('div');
		list.style.display = 'grid';
		list.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
		list.style.gap = '10px';
		list.style.maxHeight = '50vh';
		list.style.overflowY = 'auto';

		this.items.forEach((item) => {
			const card = document.createElement('div');
			card.style.border = '1px solid #ccc';
			card.style.borderRadius = '6px';
			card.style.padding = '6px';
			card.style.display = 'flex';
			card.style.flexDirection = 'column';
			card.style.gap = '6px';
			card.style.cursor = 'pointer';

			let preview;
			if (item.kind === 'image') {
				preview = document.createElement('img');
				preview.src = item.url;
				preview.style.width = '100%';
				preview.style.height = '80px';
				preview.style.objectFit = 'cover';
			} else {
				preview = document.createElement('video');
				preview.src = item.url;
				preview.muted = true;
				preview.style.width = '100%';
				preview.style.height = '80px';
				preview.style.objectFit = 'cover';
			}

			const name = document.createElement('div');
			name.textContent = item.name;
			name.style.fontSize = '10px';
			name.style.whiteSpace = 'nowrap';
			name.style.overflow = 'hidden';
			name.style.textOverflow = 'ellipsis';

			card.addEventListener('click', () => {
				if (onSelect) {
					onSelect(item);
				}
				this.closePickerDialog();
			});

			card.appendChild(preview);
			card.appendChild(name);

			if (allowRemove) {
				const remove = document.createElement('button');
				remove.textContent = 'Remove';
				remove.style.fontSize = '10px';
				remove.addEventListener('click', (e) => {
					e.stopPropagation();
					this.removeById(item.id);
					this.closePickerDialog();
					this.openPickerDialog({ title, onSelect, allowRemove });
				});
				card.appendChild(remove);
			}

			list.appendChild(card);
		});

		const actions = document.createElement('div');
		actions.style.display = 'flex';
		actions.style.justifyContent = 'flex-end';
		actions.style.marginTop = '10px';

		const close = document.createElement('button');
		close.textContent = 'Close';
		close.addEventListener('click', () => this.closePickerDialog());

		actions.appendChild(close);
		content.appendChild(list);
		content.appendChild(actions);

		document.body.appendChild(modal);
		this.pickerModal = modal;
	}

	closePickerDialog() {
		if (this.pickerModal) {
			this.pickerModal.remove();
			this.pickerModal = null;
		}
	}

	createModalShell(title) {
		const overlay = document.createElement('div');
		overlay.style.position = 'fixed';
		overlay.style.inset = '0';
		overlay.style.background = 'rgba(0,0,0,0.5)';
		overlay.style.display = 'flex';
		overlay.style.alignItems = 'center';
		overlay.style.justifyContent = 'center';
		overlay.style.zIndex = '2000';

		const modal = document.createElement('div');
		modal.style.background = '#fff';
		modal.style.color = '#000';
		modal.style.padding = '12px';
		modal.style.borderRadius = '8px';
		modal.style.width = '60vw';
		modal.style.maxWidth = '720px';
		modal.style.maxHeight = '70vh';
		modal.style.overflow = 'hidden';

		const header = document.createElement('div');
		header.textContent = title;
		header.style.fontWeight = '600';
		header.style.marginBottom = '10px';

		const content = document.createElement('div');
		content.className = 'media-storage-content';

		modal.appendChild(header);
		modal.appendChild(content);
		overlay.appendChild(modal);

		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) {
				overlay.remove();
				if (this.uploadModal === overlay) this.uploadModal = null;
				if (this.pickerModal === overlay) this.pickerModal = null;
			}
		});

		return overlay;
	}
}
