const fs = require('fs').promises;
const path = require('path');

class FileStorage {
  constructor(filename) {
    this.filePath = path.join(__dirname, '..', 'data', `${filename}.json`);
  }

  async read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  async write(data) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.read();
  }

  async findById(id) {
    const data = await this.read();
    return data.find(item => item.id === parseInt(id));
  }

  async create(newItem) {
    const data = await this.read();
    const maxId = data.length > 0 ? Math.max(...data.map(item => item.id)) : 0;
    const item = {
      ...newItem,
      id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    data.push(item);
    await this.write(data);
    return item;
  }

  async update(id, updates) {
    const data = await this.read();
    const index = data.findIndex(item => item.id === parseInt(id));
    if (index === -1) return null;

    data[index] = {
      ...data[index],
      ...updates,
      id: parseInt(id), // Preserve ID
      updatedAt: new Date().toISOString()
    };
    await this.write(data);
    return data[index];
  }

  async delete(id) {
    const data = await this.read();
    const filteredData = data.filter(item => item.id !== parseInt(id));
    if (filteredData.length === data.length) return false; // ID not found
    await this.write(filteredData);
    return true;
  }
}

module.exports = FileStorage;
