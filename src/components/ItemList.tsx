import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import {
  NINTENDO_PLATFORMS,
  PET_SPECIES_LABELS,
  PET_SPECIES_OPTIONS,
  RECIPE_DIFFICULTIES,
  RECIPE_DIFFICULTY_LABELS,
  THEME_OPTIONS,
} from '../types';
import type {
  AppItem,
  NintendoPlatform,
  PetSpecies,
  RecipeDifficulty,
  Theme,
  ThemeOption,
} from '../types';

interface ItemListProps {
  items: AppItem[];
  selectedTheme: Theme;
  onEditItem: (item: AppItem) => void;
  onDeleteItem: (itemId: string) => void;
}

const ALL_FILTER_VALUE = 'all' as const;
type BooleanFilter = typeof ALL_FILTER_VALUE | 'true' | 'false';
type SelectorFilter = typeof ALL_FILTER_VALUE | NintendoPlatform | RecipeDifficulty | PetSpecies;

interface BooleanFilterConfig {
  label: string;
  allOption: string;
  trueOption: string;
  falseOption: string;
}

interface SelectorFilterConfig {
  label: string;
  allOption: string;
  options: ReadonlyArray<{ value: string; label: string }>;
}

const formatPrice = (value: number): string =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);

const normalizeSearchValue = (value: string): string =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const BOOLEAN_FILTER_CONFIG: Readonly<Record<Theme, BooleanFilterConfig>> = {
  products: {
    label: 'Filtrar por stock',
    allOption: 'Todos',
    trueOption: 'En stock',
    falseOption: 'Sin stock',
  },
  movies: {
    label: 'Filtrar por vista',
    allOption: 'Todas',
    trueOption: 'Vistas',
    falseOption: 'No vistas',
  },
  books: {
    label: 'Filtrar por lectura',
    allOption: 'Todos',
    trueOption: 'Terminados',
    falseOption: 'Sin terminar',
  },
  nintendoGames: {
    label: 'Filtrar por completado',
    allOption: 'Todos',
    trueOption: 'Completados',
    falseOption: 'No completados',
  },
  veganRecipes: {
    label: 'Filtrar por favorita',
    allOption: 'Todas',
    trueOption: 'Favoritas',
    falseOption: 'No favoritas',
  },
  events: {
    label: 'Filtrar por asistencia',
    allOption: 'Todos',
    trueOption: 'Asistidos',
    falseOption: 'No asistidos',
  },
  trips: {
    label: 'Filtrar por planificación',
    allOption: 'Todos',
    trueOption: 'Planificados',
    falseOption: 'No planificados',
  },
  pets: {
    label: 'Filtrar por vacunación',
    allOption: 'Todas',
    trueOption: 'Vacunadas',
    falseOption: 'No vacunadas',
  },
};

const SELECTOR_FILTER_CONFIG: Readonly<Partial<Record<Theme, SelectorFilterConfig>>> = {
  nintendoGames: {
    label: 'Filtrar por consola',
    allOption: 'Todas',
    options: NINTENDO_PLATFORMS.map((platform) => ({
      value: platform,
      label: platform,
    })),
  },
  veganRecipes: {
    label: 'Filtrar por dificultad',
    allOption: 'Todas',
    options: RECIPE_DIFFICULTIES.map((difficulty) => ({
      value: difficulty,
      label: RECIPE_DIFFICULTY_LABELS[difficulty],
    })),
  },
  pets: {
    label: 'Filtrar por especie',
    allOption: 'Todas',
    options: PET_SPECIES_OPTIONS.map((species) => ({
      value: species,
      label: PET_SPECIES_LABELS[species],
    })),
  },
};

const getItemBooleanValue = (item: AppItem): boolean => {
  switch (item.kind) {
    case 'products':
      return item.inStock;
    case 'movies':
      return item.watched;
    case 'books':
      return item.finished;
    case 'nintendoGames':
      return item.completed;
    case 'veganRecipes':
      return item.favorite;
    case 'events':
      return item.attended;
    case 'trips':
      return item.planned;
    case 'pets':
      return item.vaccinated;
  }
};

const getItemSelectorValue = (item: AppItem): string | undefined => {
  switch (item.kind) {
    case 'nintendoGames':
      return item.platform;
    case 'veganRecipes':
      return item.difficulty;
    case 'pets':
      return item.species;
    default:
      return undefined;
  }
};

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

const getItemSearchText = (item: AppItem): string => {
  switch (item.kind) {
    case 'products':
      return `${item.name} ${item.category} ${item.brand}`;
    case 'movies':
      return `${item.title} ${item.genre} ${item.director}`;
    case 'books':
      return `${item.title} ${item.author} ${item.publisher}`;
    case 'nintendoGames':
      return `${item.title} ${item.platform} ${item.genre}`;
    case 'veganRecipes':
      return `${item.name} ${item.difficulty} ${RECIPE_DIFFICULTY_LABELS[item.difficulty]} ${item.mainIngredient}`;
    case 'events':
      return `${item.name} ${item.location} ${item.organizer}`;
    case 'trips':
      return `${item.destination} ${item.country} ${item.season}`;
    case 'pets':
      return `${item.name} ${item.breed} ${item.species} ${PET_SPECIES_LABELS[item.species]}`;
  }
};

const renderDetails = (item: AppItem) => {
  switch (item.kind) {
    case 'products':
      return (
        <>
          <p>Categoría: {item.category}</p>
          <p>Marca: {item.brand}</p>
          <p>Precio: {formatPrice(item.price)}</p>
          <p>Stock: {item.inStock ? 'Disponible' : 'Agotado'}</p>
        </>
      );
    case 'movies':
      return (
        <>
          <p>Género: {item.genre}</p>
          <p>Director: {item.director}</p>
          <p>Año: {item.year}</p>
          <p>Vista: {item.watched ? 'Sí' : 'No'}</p>
        </>
      );
    case 'books':
      return (
        <>
          <p>Autor: {item.author}</p>
          <p>Editorial: {item.publisher}</p>
          <p>Páginas: {item.pages}</p>
          <p>Terminado: {item.finished ? 'Sí' : 'No'}</p>
        </>
      );
    case 'nintendoGames':
      return (
        <>
          <p>Consola: {item.platform}</p>
          <p>Género: {item.genre}</p>
          <p>Precio: {formatPrice(item.price)}</p>
          <p>Completado: {item.completed ? 'Sí' : 'No'}</p>
        </>
      );
    case 'veganRecipes':
      return (
        <>
          <p>Dificultad: {RECIPE_DIFFICULTY_LABELS[item.difficulty]}</p>
          <p>Ingrediente principal: {item.mainIngredient}</p>
          <p>Tiempo: {item.minutes} minutos</p>
          <p>Favorita: {item.favorite ? 'Sí' : 'No'}</p>
        </>
      );
    case 'events':
      return (
        <>
          <p>Ubicación: {item.location}</p>
          <p>Organizador: {item.organizer}</p>
          <p>Fecha: {item.date}</p>
          <p>Asistido: {item.attended ? 'Sí' : 'No'}</p>
        </>
      );
    case 'trips':
      return (
        <>
          <p>País: {item.country}</p>
          <p>Temporada: {item.season}</p>
          <p>Duración: {item.days} días</p>
          <p>Planificado: {item.planned ? 'Sí' : 'No'}</p>
        </>
      );
    case 'pets':
      return (
        <>
          <p>Especie: {PET_SPECIES_LABELS[item.species]}</p>
          <p>Raza: {item.breed}</p>
          <p>Edad: {item.age}</p>
          <p>Vacunada: {item.vaccinated ? 'Sí' : 'No'}</p>
        </>
      );
  }
};

function ItemList({ items, selectedTheme, onEditItem, onDeleteItem }: ItemListProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectorFilter, setSelectorFilter] = useState<SelectorFilter>(ALL_FILTER_VALUE);
  const [booleanFilter, setBooleanFilter] = useState<BooleanFilter>(ALL_FILTER_VALUE);
  const selectorFilterConfig: SelectorFilterConfig | undefined = SELECTOR_FILTER_CONFIG[selectedTheme];

  useEffect((): void => {
    setSearchTerm('');
    setSelectorFilter(ALL_FILTER_VALUE);
    setBooleanFilter(ALL_FILTER_VALUE);
  }, [selectedTheme]);

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>, item: AppItem): void => {
    event.preventDefault();
    onEditItem(item);
  };

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>, itemId: string): void => {
    event.preventDefault();
    onDeleteItem(itemId);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.currentTarget.value);
  };

  const handleSelectorFilterChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const nextFilter: string = event.currentTarget.value;
    if (nextFilter === ALL_FILTER_VALUE) {
      setSelectorFilter(ALL_FILTER_VALUE);
      return;
    }

    if (
      selectorFilterConfig !== undefined &&
      selectorFilterConfig.options.some((option): boolean => option.value === nextFilter)
    ) {
      setSelectorFilter(nextFilter as SelectorFilter);
    }
  };

  const handleBooleanFilterChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const nextFilter: string = event.currentTarget.value;
    if (nextFilter === ALL_FILTER_VALUE || nextFilter === 'true' || nextFilter === 'false') {
      setBooleanFilter(nextFilter);
    }
  };

  const filteredItems: AppItem[] = useMemo((): AppItem[] => {
    const normalizedSearchTerm: string = normalizeSearchValue(searchTerm);
    const searchTokens: string[] = normalizedSearchTerm.split(/\s+/).filter(Boolean);

    return items.filter((item: AppItem): boolean => {
      if (selectorFilterConfig !== undefined && selectorFilter !== ALL_FILTER_VALUE) {
        const itemSelectorValue: string | undefined = getItemSelectorValue(item);
        if (itemSelectorValue !== selectorFilter) {
          return false;
        }
      }

      if (booleanFilter !== ALL_FILTER_VALUE) {
        const itemBooleanValue: boolean = getItemBooleanValue(item);
        if (booleanFilter === 'true' && !itemBooleanValue) {
          return false;
        }
        if (booleanFilter === 'false' && itemBooleanValue) {
          return false;
        }
      }

      if (searchTokens.length === 0) {
        return true;
      }

      const searchableText: string = normalizeSearchValue(
        `${getItemTitle(item)} ${getThemeLabelByKind(item.kind)} ${getItemSearchText(item)}`,
      );

      return searchTokens.every((token: string): boolean => searchableText.includes(token));
    });
  }, [booleanFilter, items, searchTerm, selectorFilter, selectorFilterConfig]);

  const booleanFilterConfig: BooleanFilterConfig = BOOLEAN_FILTER_CONFIG[selectedTheme];

  return (
    <section className="card list-card">
      <h2>Listado del tema actual</h2>

      <div className="list-controls">
        <div className="list-control">
          <label htmlFor="search-items">Buscar por nombre o datos</label>
          <input
            id="search-items"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Ej: luna, mestizo, García..."
          />
        </div>

        <div className="list-control">
          <label htmlFor="filter-boolean">{booleanFilterConfig.label}</label>
          <select
            id="filter-boolean"
            value={booleanFilter}
            onChange={handleBooleanFilterChange}
          >
            <option value="all">{booleanFilterConfig.allOption}</option>
            <option value="true">{booleanFilterConfig.trueOption}</option>
            <option value="false">{booleanFilterConfig.falseOption}</option>
          </select>
        </div>

        {selectorFilterConfig !== undefined && (
          <div className="list-control">
            <label htmlFor="filter-selector">{selectorFilterConfig.label}</label>
            <select id="filter-selector" value={selectorFilter} onChange={handleSelectorFilterChange}>
              <option value="all">{selectorFilterConfig.allOption}</option>
              {selectorFilterConfig.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {items.length === 0 && <p className="empty-state">No hay elementos para este tema.</p>}

      {items.length > 0 && filteredItems.length === 0 && (
        <p className="empty-state">No hay resultados con el buscador y filtro actual.</p>
      )}

      {filteredItems.length > 0 && (
        <ul className="item-list">
          {filteredItems.map((item: AppItem) => (
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
