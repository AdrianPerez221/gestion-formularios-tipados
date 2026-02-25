import { useEffect, useState } from 'react';
import EditItemModal from './components/EditItemModal';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import ThemeSelector from './components/ThemeSelector';
import { saveState, loadState } from './utils/storage';
import type { AppItem, StoredAppState, Theme } from './types';

function App() {
  const [appState, setAppState] = useState<StoredAppState>(loadState);
  const [editingItem, setEditingItem] = useState<AppItem | null>(null);

  useEffect((): void => {
    saveState(appState);
  }, [appState]);

  const handleThemeChange = (theme: Theme): void => {
    setAppState((previousState: StoredAppState): StoredAppState => ({
      ...previousState,
      theme,
    }));
    setEditingItem(null);
  };

  const handleCreateItem = (item: AppItem): void => {
    setAppState((previousState: StoredAppState): StoredAppState => ({
      ...previousState,
      items: [item, ...previousState.items],
    }));
  };

  const handleDeleteItem = (itemId: string): void => {
    setAppState((previousState: StoredAppState): StoredAppState => ({
      ...previousState,
      items: previousState.items.filter((item: AppItem): boolean => item.id !== itemId),
    }));

    setEditingItem((currentEditingItem: AppItem | null): AppItem | null => {
      if (currentEditingItem === null) {
        return null;
      }
      return currentEditingItem.id === itemId ? null : currentEditingItem;
    });
  };

  const handleStartEdit = (item: AppItem): void => {
    setEditingItem(item);
  };

  const handleSaveEditedItem = (updatedItem: AppItem): void => {
    setAppState((previousState: StoredAppState): StoredAppState => ({
      ...previousState,
      items: previousState.items.map((item: AppItem): AppItem =>
        item.id === updatedItem.id ? updatedItem : item,
      ),
    }));
    setEditingItem(null);
  };

  const handleCloseModal = (): void => {
    setEditingItem(null);
  };

  const visibleItems: AppItem[] = appState.items.filter(
    (item: AppItem): boolean => item.kind === appState.theme,
  );

  return (
    <main className="app-shell">
      <header className="app-header card">
        <h1>Gestión Multi-Tema de Formularios Tipados</h1>
        <p>
          Administra elementos por tema: crea, filtra, edita en modal y elimina. Los datos se
          guardan automáticamente en localStorage.
        </p>
      </header>

      <ThemeSelector selectedTheme={appState.theme} onThemeChange={handleThemeChange} />
      <ItemForm selectedTheme={appState.theme} onCreateItem={handleCreateItem} />
      <ItemList
        items={visibleItems}
        selectedTheme={appState.theme}
        onEditItem={handleStartEdit}
        onDeleteItem={handleDeleteItem}
      />

      <EditItemModal
        isOpen={editingItem !== null}
        itemToEdit={editingItem}
        onSave={handleSaveEditedItem}
        onClose={handleCloseModal}
      />
    </main>
  );
}

export default App;
