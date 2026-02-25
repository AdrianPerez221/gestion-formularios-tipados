import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent } from 'react';
import {
  NINTENDO_PLATFORMS,
  PET_SPECIES_OPTIONS,
  PET_SPECIES_LABELS,
  RECIPE_DIFFICULTIES,
  RECIPE_DIFFICULTY_LABELS,
  buildItemFromDraft,
  itemToDraft,
  updateDraftBooleanField,
  updateDraftTextField,
} from '../types';
import type { AppItem, ItemDraft, NintendoPlatform, PetSpecies, RecipeDifficulty } from '../types';

interface EditItemModalProps {
  isOpen: boolean;
  itemToEdit: AppItem | null;
  onSave: (item: AppItem) => void;
  onClose: () => void;
}

function EditItemModal({ isOpen, itemToEdit, onSave, onClose }: EditItemModalProps) {
  const [draft, setDraft] = useState<ItemDraft | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect((): void => {
    if (!isOpen || itemToEdit === null) {
      setDraft(null);
      setErrorMessage('');
      return;
    }

    setDraft(itemToDraft(itemToEdit));
    setErrorMessage('');
  }, [isOpen, itemToEdit]);

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = event.currentTarget;
    setDraft((previous: ItemDraft | null): ItemDraft | null => {
      if (previous === null) {
        return previous;
      }
      return updateDraftTextField(previous, name, value);
    });
    setErrorMessage('');
  };

  const handleBooleanChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = event.currentTarget;
    setDraft((previous: ItemDraft | null): ItemDraft | null => {
      if (previous === null) {
        return previous;
      }
      return updateDraftBooleanField(previous, name, checked);
    });
    setErrorMessage('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (draft === null || itemToEdit === null) {
      return;
    }

    const updateResult = buildItemFromDraft(draft, itemToEdit.id);
    if (!updateResult.ok) {
      setErrorMessage(updateResult.error);
      return;
    }

    onSave(updateResult.value);
    onClose();
  };

  const handleCloseClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    onClose();
  };

  const renderFields = (currentDraft: ItemDraft) => {
    switch (currentDraft.kind) {
      case 'products':
        return (
          <>
            <label htmlFor="edit-product-name">Nombre</label>
            <input
              id="edit-product-name"
              name="name"
              type="text"
              value={currentDraft.name}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-product-category">Categoría</label>
            <input
              id="edit-product-category"
              name="category"
              type="text"
              value={currentDraft.category}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-product-brand">Marca</label>
            <input
              id="edit-product-brand"
              name="brand"
              type="text"
              value={currentDraft.brand}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-product-price">Precio</label>
            <input
              id="edit-product-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={currentDraft.price}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="edit-product-stock">
              <input
                id="edit-product-stock"
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
            <label htmlFor="edit-movie-title">Título</label>
            <input
              id="edit-movie-title"
              name="title"
              type="text"
              value={currentDraft.title}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-movie-genre">Género</label>
            <input
              id="edit-movie-genre"
              name="genre"
              type="text"
              value={currentDraft.genre}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-movie-director">Director</label>
            <input
              id="edit-movie-director"
              name="director"
              type="text"
              value={currentDraft.director}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-movie-year">Año</label>
            <input
              id="edit-movie-year"
              name="year"
              type="number"
              min="1888"
              step="1"
              value={currentDraft.year}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="edit-movie-watched">
              <input
                id="edit-movie-watched"
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
            <label htmlFor="edit-book-title">Título</label>
            <input
              id="edit-book-title"
              name="title"
              type="text"
              value={currentDraft.title}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-book-author">Autor</label>
            <input
              id="edit-book-author"
              name="author"
              type="text"
              value={currentDraft.author}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-book-publisher">Editorial</label>
            <input
              id="edit-book-publisher"
              name="publisher"
              type="text"
              value={currentDraft.publisher}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-book-pages">Páginas</label>
            <input
              id="edit-book-pages"
              name="pages"
              type="number"
              min="1"
              step="1"
              value={currentDraft.pages}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="edit-book-finished">
              <input
                id="edit-book-finished"
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
            <label htmlFor="edit-nintendo-title">Título</label>
            <input
              id="edit-nintendo-title"
              name="title"
              type="text"
              value={currentDraft.title}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-nintendo-platform">Consola Nintendo</label>
            <select
              id="edit-nintendo-platform"
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

            <label htmlFor="edit-nintendo-genre">Género</label>
            <input
              id="edit-nintendo-genre"
              name="genre"
              type="text"
              value={currentDraft.genre}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-nintendo-price">Precio</label>
            <input
              id="edit-nintendo-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={currentDraft.price}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="edit-nintendo-completed">
              <input
                id="edit-nintendo-completed"
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
            <label htmlFor="edit-recipe-name">Nombre</label>
            <input
              id="edit-recipe-name"
              name="name"
              type="text"
              value={currentDraft.name}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-recipe-difficulty">Dificultad</label>
            <select
              id="edit-recipe-difficulty"
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

            <label htmlFor="edit-recipe-main-ingredient">Ingrediente principal</label>
            <input
              id="edit-recipe-main-ingredient"
              name="mainIngredient"
              type="text"
              value={currentDraft.mainIngredient}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-recipe-minutes">Minutos</label>
            <input
              id="edit-recipe-minutes"
              name="minutes"
              type="number"
              min="1"
              step="1"
              value={currentDraft.minutes}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="edit-recipe-favorite">
              <input
                id="edit-recipe-favorite"
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
            <label htmlFor="edit-event-name">Nombre</label>
            <input
              id="edit-event-name"
              name="name"
              type="text"
              value={currentDraft.name}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-event-location">Ubicación</label>
            <input
              id="edit-event-location"
              name="location"
              type="text"
              value={currentDraft.location}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-event-organizer">Organizador</label>
            <input
              id="edit-event-organizer"
              name="organizer"
              type="text"
              value={currentDraft.organizer}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-event-date">Fecha</label>
            <input
              id="edit-event-date"
              name="date"
              type="date"
              value={currentDraft.date}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="edit-event-attended">
              <input
                id="edit-event-attended"
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
            <label htmlFor="edit-trip-destination">Destino</label>
            <input
              id="edit-trip-destination"
              name="destination"
              type="text"
              value={currentDraft.destination}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-trip-country">País</label>
            <input
              id="edit-trip-country"
              name="country"
              type="text"
              value={currentDraft.country}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-trip-season">Temporada</label>
            <input
              id="edit-trip-season"
              name="season"
              type="text"
              value={currentDraft.season}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-trip-days">Días</label>
            <input
              id="edit-trip-days"
              name="days"
              type="number"
              min="1"
              step="1"
              value={currentDraft.days}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="edit-trip-planned">
              <input
                id="edit-trip-planned"
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
            <label htmlFor="edit-pet-name">Nombre</label>
            <input
              id="edit-pet-name"
              name="name"
              type="text"
              value={currentDraft.name}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-pet-species">Especie</label>
            <select
              id="edit-pet-species"
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

            <label htmlFor="edit-pet-breed">Raza</label>
            <input
              id="edit-pet-breed"
              name="breed"
              type="text"
              value={currentDraft.breed}
              onChange={handleFieldChange}
            />

            <label htmlFor="edit-pet-age">Edad</label>
            <input
              id="edit-pet-age"
              name="age"
              type="number"
              min="0"
              step="1"
              value={currentDraft.age}
              onChange={handleFieldChange}
            />

            <label className="checkbox-row" htmlFor="edit-pet-vaccinated">
              <input
                id="edit-pet-vaccinated"
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

  if (!isOpen || draft === null || itemToEdit === null) {
    return null;
  }

  return (
    <div className="modal-overlay" role="presentation">
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
        <div className="modal-header">
          <h2 id="edit-modal-title">Editar elemento</h2>
          <button type="button" className="secondary" onClick={handleCloseClick}>
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          {renderFields(draft)}
          {errorMessage.length > 0 && (
            <p className="form-error" aria-live="polite">
              {errorMessage}
            </p>
          )}

          <div className="form-actions">
            <button type="submit">Guardar cambios</button>
            <button type="button" className="secondary" onClick={handleCloseClick}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditItemModal;
