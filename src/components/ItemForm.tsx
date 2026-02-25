import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  NINTENDO_PLATFORMS,
  PET_SPECIES_OPTIONS,
  PET_SPECIES_LABELS,
  RECIPE_DIFFICULTIES,
  RECIPE_DIFFICULTY_LABELS,
  THEME_OPTIONS,
  buildItemFromDraft,
  createEmptyDraft,
  updateDraftBooleanField,
  updateDraftTextField,
} from '../types';
import type {
  AppItem,
  ItemDraft,
  NintendoPlatform,
  PetSpecies,
  RecipeDifficulty,
  Theme,
  ThemeOption,
} from '../types';

interface ItemFormProps {
  selectedTheme: Theme;
  onCreateItem: (item: AppItem) => void;
}

const getThemeLabel = (theme: Theme): string => {
  const matchingOption: ThemeOption | undefined = THEME_OPTIONS.find(
    (option: ThemeOption): boolean => option.value === theme,
  );
  return matchingOption === undefined ? theme : matchingOption.label;
};

function ItemForm({ selectedTheme, onCreateItem }: ItemFormProps) {
  const [draft, setDraft] = useState<ItemDraft>(createEmptyDraft(selectedTheme));
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect((): void => {
    setDraft(createEmptyDraft(selectedTheme));
    setErrorMessage('');
  }, [selectedTheme]);

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = event.currentTarget;
    setDraft((previous: ItemDraft): ItemDraft => updateDraftTextField(previous, name, value));
    setErrorMessage('');
  };

  const handleBooleanChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = event.currentTarget;
    setDraft((previous: ItemDraft): ItemDraft =>
      updateDraftBooleanField(previous, name, checked),
    );
    setErrorMessage('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const creationResult = buildItemFromDraft(draft);
    if (!creationResult.ok) {
      setErrorMessage(creationResult.error);
      return;
    }

    onCreateItem(creationResult.value);
    setDraft(createEmptyDraft(selectedTheme));
    setErrorMessage('');
  };

  const renderFields = (currentDraft: ItemDraft) => {
    switch (currentDraft.kind) {
      case 'products':
        return (
          <>
            <label htmlFor="product-name">Nombre</label>
            <input
              id="product-name"
              name="name"
              type="text"
              value={currentDraft.name}
              onChange={handleFieldChange}
              placeholder="Ej: Alpargatas Clásicas"
            />

            <label htmlFor="product-category">Categoría</label>
            <input
              id="product-category"
              name="category"
              type="text"
              value={currentDraft.category}
              onChange={handleFieldChange}
              placeholder="Ej: Calzado"
            />

            <label htmlFor="product-brand">Marca</label>
            <input
              id="product-brand"
              name="brand"
              type="text"
              value={currentDraft.brand}
              onChange={handleFieldChange}
              placeholder="Ej: SurAndes"
            />

            <label htmlFor="product-price">Precio</label>
            <input
              id="product-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={currentDraft.price}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="product-stock">
              <input
                id="product-stock"
                name="inStock"
                type="checkbox"
                checked={currentDraft.inStock}
                onChange={handleBooleanChange}
              />
              En stock
            </label>
          </>
        );
      case 'movies':
        return (
          <>
            <label htmlFor="movie-title">Título</label>
            <input
              id="movie-title"
              name="title"
              type="text"
              value={currentDraft.title}
              onChange={handleFieldChange}
              placeholder="Ej: Interstellar"
            />

            <label htmlFor="movie-genre">Género</label>
            <input
              id="movie-genre"
              name="genre"
              type="text"
              value={currentDraft.genre}
              onChange={handleFieldChange}
              placeholder="Ej: Ciencia ficción"
            />

            <label htmlFor="movie-director">Director</label>
            <input
              id="movie-director"
              name="director"
              type="text"
              value={currentDraft.director}
              onChange={handleFieldChange}
              placeholder="Ej: Christopher Nolan"
            />

            <label htmlFor="movie-year">Año</label>
            <input
              id="movie-year"
              name="year"
              type="number"
              min="1888"
              step="1"
              value={currentDraft.year}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="movie-watched">
              <input
                id="movie-watched"
                name="watched"
                type="checkbox"
                checked={currentDraft.watched}
                onChange={handleBooleanChange}
              />
              Vista
            </label>
          </>
        );
      case 'books':
        return (
          <>
            <label htmlFor="book-title">Título</label>
            <input
              id="book-title"
              name="title"
              type="text"
              value={currentDraft.title}
              onChange={handleFieldChange}
              placeholder="Ej: Cien años de soledad"
            />

            <label htmlFor="book-author">Autor</label>
            <input
              id="book-author"
              name="author"
              type="text"
              value={currentDraft.author}
              onChange={handleFieldChange}
              placeholder="Ej: Gabriel García Márquez"
            />

            <label htmlFor="book-publisher">Editorial</label>
            <input
              id="book-publisher"
              name="publisher"
              type="text"
              value={currentDraft.publisher}
              onChange={handleFieldChange}
              placeholder="Ej: Sudamericana"
            />

            <label htmlFor="book-pages">Páginas</label>
            <input
              id="book-pages"
              name="pages"
              type="number"
              min="1"
              step="1"
              value={currentDraft.pages}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="book-finished">
              <input
                id="book-finished"
                name="finished"
                type="checkbox"
                checked={currentDraft.finished}
                onChange={handleBooleanChange}
              />
              Terminado
            </label>
          </>
        );
      case 'nintendoGames':
        return (
          <>
            <label htmlFor="nintendo-title">Título</label>
            <input
              id="nintendo-title"
              name="title"
              type="text"
              value={currentDraft.title}
              onChange={handleFieldChange}
              placeholder="Ej: Zelda Tears of the Kingdom"
            />

            <label htmlFor="nintendo-platform">Consola Nintendo</label>
            <select
              id="nintendo-platform"
              name="platform"
              value={currentDraft.platform}
              onChange={handleFieldChange}
            >
              {NINTENDO_PLATFORMS.map((platform: NintendoPlatform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>

            <label htmlFor="nintendo-genre">Género</label>
            <input
              id="nintendo-genre"
              name="genre"
              type="text"
              value={currentDraft.genre}
              onChange={handleFieldChange}
              placeholder="Ej: Aventura"
            />

            <label htmlFor="nintendo-price">Precio</label>
            <input
              id="nintendo-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={currentDraft.price}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="nintendo-completed">
              <input
                id="nintendo-completed"
                name="completed"
                type="checkbox"
                checked={currentDraft.completed}
                onChange={handleBooleanChange}
              />
              Completado
            </label>
          </>
        );
      case 'veganRecipes':
        return (
          <>
            <label htmlFor="recipe-name">Nombre</label>
            <input
              id="recipe-name"
              name="name"
              type="text"
              value={currentDraft.name}
              onChange={handleFieldChange}
              placeholder="Ej: Curry de garbanzos"
            />

            <label htmlFor="recipe-difficulty">Dificultad</label>
            <select
              id="recipe-difficulty"
              name="difficulty"
              value={currentDraft.difficulty}
              onChange={handleFieldChange}
            >
              {RECIPE_DIFFICULTIES.map((difficulty: RecipeDifficulty) => (
                <option key={difficulty} value={difficulty}>
                  {RECIPE_DIFFICULTY_LABELS[difficulty]}
                </option>
              ))}
            </select>

            <label htmlFor="recipe-main-ingredient">Ingrediente principal</label>
            <input
              id="recipe-main-ingredient"
              name="mainIngredient"
              type="text"
              value={currentDraft.mainIngredient}
              onChange={handleFieldChange}
              placeholder="Ej: Garbanzos"
            />

            <label htmlFor="recipe-minutes">Minutos</label>
            <input
              id="recipe-minutes"
              name="minutes"
              type="number"
              min="1"
              step="1"
              value={currentDraft.minutes}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="recipe-favorite">
              <input
                id="recipe-favorite"
                name="favorite"
                type="checkbox"
                checked={currentDraft.favorite}
                onChange={handleBooleanChange}
              />
              Favorita
            </label>
          </>
        );
      case 'events':
        return (
          <>
            <label htmlFor="event-name">Nombre</label>
            <input
              id="event-name"
              name="name"
              type="text"
              value={currentDraft.name}
              onChange={handleFieldChange}
              placeholder="Ej: Feria de Innovación"
            />

            <label htmlFor="event-location">Ubicación</label>
            <input
              id="event-location"
              name="location"
              type="text"
              value={currentDraft.location}
              onChange={handleFieldChange}
              placeholder="Ej: Madrid"
            />

            <label htmlFor="event-organizer">Organizador</label>
            <input
              id="event-organizer"
              name="organizer"
              type="text"
              value={currentDraft.organizer}
              onChange={handleFieldChange}
              placeholder="Ej: Tech Hub"
            />

            <label htmlFor="event-date">Fecha</label>
            <input
              id="event-date"
              name="date"
              type="date"
              value={currentDraft.date}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="event-attended">
              <input
                id="event-attended"
                name="attended"
                type="checkbox"
                checked={currentDraft.attended}
                onChange={handleBooleanChange}
              />
              Asistido
            </label>
          </>
        );
      case 'trips':
        return (
          <>
            <label htmlFor="trip-destination">Destino</label>
            <input
              id="trip-destination"
              name="destination"
              type="text"
              value={currentDraft.destination}
              onChange={handleFieldChange}
              placeholder="Ej: Kioto"
            />

            <label htmlFor="trip-country">País</label>
            <input
              id="trip-country"
              name="country"
              type="text"
              value={currentDraft.country}
              onChange={handleFieldChange}
              placeholder="Ej: Japón"
            />

            <label htmlFor="trip-season">Temporada</label>
            <input
              id="trip-season"
              name="season"
              type="text"
              value={currentDraft.season}
              onChange={handleFieldChange}
              placeholder="Ej: Primavera"
            />

            <label htmlFor="trip-days">Días</label>
            <input
              id="trip-days"
              name="days"
              type="number"
              min="1"
              step="1"
              value={currentDraft.days}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="trip-planned">
              <input
                id="trip-planned"
                name="planned"
                type="checkbox"
                checked={currentDraft.planned}
                onChange={handleBooleanChange}
              />
              Planificado
            </label>
          </>
        );
      case 'pets':
        return (
          <>
            <label htmlFor="pet-name">Nombre</label>
            <input
              id="pet-name"
              name="name"
              type="text"
              value={currentDraft.name}
              onChange={handleFieldChange}
              placeholder="Ej: Luna"
            />

            <label htmlFor="pet-species">Especie</label>
            <select
              id="pet-species"
              name="species"
              value={currentDraft.species}
              onChange={handleFieldChange}
            >
              {PET_SPECIES_OPTIONS.map((species: PetSpecies) => (
                <option key={species} value={species}>
                  {PET_SPECIES_LABELS[species]}
                </option>
              ))}
            </select>

            <label htmlFor="pet-breed">Raza</label>
            <input
              id="pet-breed"
              name="breed"
              type="text"
              value={currentDraft.breed}
              onChange={handleFieldChange}
              placeholder="Ej: Mestizo"
            />

            <label htmlFor="pet-age">Edad</label>
            <input
              id="pet-age"
              name="age"
              type="number"
              min="0"
              step="1"
              value={currentDraft.age}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="pet-vaccinated">
              <input
                id="pet-vaccinated"
                name="vaccinated"
                type="checkbox"
                checked={currentDraft.vaccinated}
                onChange={handleBooleanChange}
              />
              Vacunada
            </label>
          </>
        );
    }
  };

  return (
    <section className="card form-card">
      <h2>Crear ítem: {getThemeLabel(selectedTheme)}</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        {renderFields(draft)}
        {errorMessage.length > 0 && (
          <p className="form-error" aria-live="polite">
            {errorMessage}
          </p>
        )}
        <div className="form-actions">
          <button type="submit">Agregar</button>
        </div>
      </form>
    </section>
  );
}

export default ItemForm;
