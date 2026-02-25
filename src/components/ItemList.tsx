import type { MouseEvent } from 'react';
import { THEME_OPTIONS } from '../types';
import type { AppItem, ThemeOption } from '../types';

interface ItemListProps {
  items: AppItem[];
  onEditItem: (item: AppItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const formatPrice = (value: number): string =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);

const getThemeLabelByKind = (kind: AppItem['kind']): string => {
  const option: ThemeOption | undefined = THEME_OPTIONS.find(
    (entry: ThemeOption): boolean => entry.value === kind,
  );
  return option === undefined ? kind : option.label;
};

const getItemTitle = (item: AppItem): string => {
  switch (item.kind) {
    case 'products':
      return item.name;
    case 'movies':
      return item.title;
    case 'books':
      return item.title;
    case 'nintendoGames':
      return item.title;
    case 'veganRecipes':
      return item.name;
    case 'events':
      return item.name;
    case 'trips':
      return item.destination;
    case 'pets':
      return item.name;
  }
};

const renderDetails = (item: AppItem) => {
  switch (item.kind) {
    case 'products':
      return (
        <>
          <p>Categoria: {item.category}</p>
          <p>Marca: {item.brand}</p>
          <p>Precio: {formatPrice(item.price)}</p>
          <p>Stock: {item.inStock ? 'Disponible' : 'Agotado'}</p>
        </>
      );
    case 'movies':
      return (
        <>
          <p>Genero: {item.genre}</p>
          <p>Director: {item.director}</p>
          <p>Anio: {item.year}</p>
          <p>Vista: {item.watched ? 'Si' : 'No'}</p>
        </>
      );
    case 'books':
      return (
        <>
          <p>Autor: {item.author}</p>
          <p>Editorial: {item.publisher}</p>
          <p>Paginas: {item.pages}</p>
          <p>Terminado: {item.finished ? 'Si' : 'No'}</p>
        </>
      );
    case 'nintendoGames':
      return (
        <>
          <p>Consola: {item.platform}</p>
          <p>Genero: {item.genre}</p>
          <p>Precio: {formatPrice(item.price)}</p>
          <p>Completado: {item.completed ? 'Si' : 'No'}</p>
        </>
      );
    case 'veganRecipes':
      return (
        <>
          <p>Dificultad: {item.difficulty}</p>
          <p>Ingrediente principal: {item.mainIngredient}</p>
          <p>Tiempo: {item.minutes} minutos</p>
          <p>Favorita: {item.favorite ? 'Si' : 'No'}</p>
        </>
      );
    case 'events':
      return (
        <>
          <p>Ubicacion: {item.location}</p>
          <p>Organizador: {item.organizer}</p>
          <p>Fecha: {item.date}</p>
          <p>Asistido: {item.attended ? 'Si' : 'No'}</p>
        </>
      );
    case 'trips':
      return (
        <>
          <p>Pais: {item.country}</p>
          <p>Temporada: {item.season}</p>
          <p>Duracion: {item.days} dias</p>
          <p>Planificado: {item.planned ? 'Si' : 'No'}</p>
        </>
      );
    case 'pets':
      return (
        <>
          <p>Especie: {item.species}</p>
          <p>Raza: {item.breed}</p>
          <p>Edad: {item.age}</p>
          <p>Vacunada: {item.vaccinated ? 'Si' : 'No'}</p>
        </>
      );
  }
};

function ItemList({ items, onEditItem, onDeleteItem }: ItemListProps) {
  const handleEditClick = (event: MouseEvent<HTMLButtonElement>, item: AppItem): void => {
    event.preventDefault();
    onEditItem(item);
  };

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>, itemId: string): void => {
    event.preventDefault();
    onDeleteItem(itemId);
  };

  return (
    <section className="card">
      <h2>Listado del tema actual</h2>
      {items.length === 0 && <p className="empty-state">No hay elementos para este tema.</p>}

      {items.length > 0 && (
        <ul className="item-list">
          {items.map((item: AppItem) => (
            <li key={item.id} className="item-card">
              <div className="item-header">
                <h3>{getItemTitle(item)}</h3>
                <span className="badge">{getThemeLabelByKind(item.kind)}</span>
              </div>

              <div className="item-details">{renderDetails(item)}</div>

              <div className="item-actions">
                <button
                  type="button"
                  onClick={(event: MouseEvent<HTMLButtonElement>): void =>
                    handleEditClick(event, item)
                  }
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={(event: MouseEvent<HTMLButtonElement>): void =>
                    handleDeleteClick(event, item.id)
                  }
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ItemList;
