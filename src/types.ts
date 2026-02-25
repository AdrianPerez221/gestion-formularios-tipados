export type Theme =
  | 'products'
  | 'movies'
  | 'books'
  | 'nintendoGames'
  | 'veganRecipes'
  | 'events'
  | 'trips'
  | 'pets';

export interface ThemeOption {
  value: Theme;
  label: string;
}

export const THEME_OPTIONS: ReadonlyArray<ThemeOption> = [
  { value: 'products', label: 'Productos' },
  { value: 'movies', label: 'Películas/Series' },
  { value: 'books', label: 'Libros' },
  { value: 'nintendoGames', label: 'Videojuegos Nintendo' },
  { value: 'veganRecipes', label: 'Recetas Veganas' },
  { value: 'events', label: 'Eventos' },
  { value: 'trips', label: 'Viajes' },
  { value: 'pets', label: 'Mascotas' },
];

export const DEFAULT_THEME: Theme = 'products';

export type NintendoPlatform =
  | 'Switch'
  | 'Wii U'
  | '3DS'
  | 'DS'
  | 'Wii'
  | 'GameCube'
  | 'N64'
  | 'SNES'
  | 'NES';

export type RecipeDifficulty = 'easy' | 'medium' | 'hard';
export type PetSpecies = 'dog' | 'cat' | 'other';

export const NINTENDO_PLATFORMS: ReadonlyArray<NintendoPlatform> = [
  'Switch',
  'Wii U',
  '3DS',
  'DS',
  'Wii',
  'GameCube',
  'N64',
  'SNES',
  'NES',
];

export const RECIPE_DIFFICULTIES: ReadonlyArray<RecipeDifficulty> = ['easy', 'medium', 'hard'];
export const RECIPE_DIFFICULTY_LABELS: Readonly<Record<RecipeDifficulty, string>> = {
  easy: 'Fácil',
  medium: 'Media',
  hard: 'Difícil',
};
export const PET_SPECIES_OPTIONS: ReadonlyArray<PetSpecies> = ['dog', 'cat', 'other'];
export const PET_SPECIES_LABELS: Readonly<Record<PetSpecies, string>> = {
  dog: 'Perro',
  cat: 'Gato',
  other: 'Otro',
};

export interface ProductItem {
  id: string;
  kind: 'products';
  name: string;
  category: string;
  brand: string;
  price: number;
  inStock: boolean;
}

export interface MovieItem {
  id: string;
  kind: 'movies';
  title: string;
  genre: string;
  director: string;
  year: number;
  watched: boolean;
}

export interface BookItem {
  id: string;
  kind: 'books';
  title: string;
  author: string;
  publisher: string;
  pages: number;
  finished: boolean;
}

export interface NintendoGameItem {
  id: string;
  kind: 'nintendoGames';
  title: string;
  platform: NintendoPlatform;
  genre: string;
  price: number;
  completed: boolean;
}

export interface VeganRecipeItem {
  id: string;
  kind: 'veganRecipes';
  name: string;
  difficulty: RecipeDifficulty;
  mainIngredient: string;
  minutes: number;
  favorite: boolean;
}

export interface EventItem {
  id: string;
  kind: 'events';
  name: string;
  location: string;
  organizer: string;
  date: string;
  attended: boolean;
}

export interface TripItem {
  id: string;
  kind: 'trips';
  destination: string;
  country: string;
  season: string;
  days: number;
  planned: boolean;
}

export interface PetItem {
  id: string;
  kind: 'pets';
  name: string;
  species: PetSpecies;
  breed: string;
  age: number;
  vaccinated: boolean;
}

export type AppItem =
  | ProductItem
  | MovieItem
  | BookItem
  | NintendoGameItem
  | VeganRecipeItem
  | EventItem
  | TripItem
  | PetItem;

export interface ProductDraft {
  kind: 'products';
  name: string;
  category: string;
  brand: string;
  price: string;
  inStock: boolean;
}

export interface MovieDraft {
  kind: 'movies';
  title: string;
  genre: string;
  director: string;
  year: string;
  watched: boolean;
}

export interface BookDraft {
  kind: 'books';
  title: string;
  author: string;
  publisher: string;
  pages: string;
  finished: boolean;
}

export interface NintendoGameDraft {
  kind: 'nintendoGames';
  title: string;
  platform: NintendoPlatform;
  genre: string;
  price: string;
  completed: boolean;
}

export interface VeganRecipeDraft {
  kind: 'veganRecipes';
  name: string;
  difficulty: RecipeDifficulty;
  mainIngredient: string;
  minutes: string;
  favorite: boolean;
}

export interface EventDraft {
  kind: 'events';
  name: string;
  location: string;
  organizer: string;
  date: string;
  attended: boolean;
}

export interface TripDraft {
  kind: 'trips';
  destination: string;
  country: string;
  season: string;
  days: string;
  planned: boolean;
}

export interface PetDraft {
  kind: 'pets';
  name: string;
  species: PetSpecies;
  breed: string;
  age: string;
  vaccinated: boolean;
}

export type ItemDraft =
  | ProductDraft
  | MovieDraft
  | BookDraft
  | NintendoGameDraft
  | VeganRecipeDraft
  | EventDraft
  | TripDraft
  | PetDraft;

export interface StoredAppState {
  theme: Theme;
  items: AppItem[];
}

type ValidationResult<T> = { ok: true; value: T } | { ok: false; error: string };
export type BuildItemResult = ValidationResult<AppItem>;

const THEME_VALUES: ReadonlyArray<Theme> = [
  'products',
  'movies',
  'books',
  'nintendoGames',
  'veganRecipes',
  'events',
  'trips',
  'pets',
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readString = (value: string): string => value.trim();

const readRequiredText = (value: string, label: string): ValidationResult<string> => {
  const normalizedValue: string = readString(value);
  if (normalizedValue.length === 0) {
    return { ok: false, error: `${label} es obligatorio.` };
  }
  return { ok: true, value: normalizedValue };
};

const readNumberValue = (
  value: string,
  label: string,
  min: number,
  mustBeInteger: boolean,
): ValidationResult<number> => {
  const normalizedValue: string = readString(value);
  if (normalizedValue.length === 0) {
    return { ok: false, error: `${label} es obligatorio.` };
  }

  const parsedValue: number = Number(normalizedValue);
  if (!Number.isFinite(parsedValue) || Number.isNaN(parsedValue)) {
    return { ok: false, error: `${label} debe ser un número válido.` };
  }
  if (parsedValue < min) {
    return { ok: false, error: `${label} debe ser mayor o igual a ${min}.` };
  }
  if (mustBeInteger && !Number.isInteger(parsedValue)) {
    return { ok: false, error: `${label} debe ser un número entero.` };
  }

  return { ok: true, value: parsedValue };
};

const hasString = (record: Record<string, unknown>, key: string): boolean =>
  typeof record[key] === 'string';

const hasBoolean = (record: Record<string, unknown>, key: string): boolean =>
  typeof record[key] === 'boolean';

const hasFiniteNumber = (record: Record<string, unknown>, key: string): boolean =>
  typeof record[key] === 'number' && Number.isFinite(record[key]);

export const isTheme = (value: string): value is Theme =>
  THEME_VALUES.some((themeValue: Theme): boolean => themeValue === value);

export const isNintendoPlatform = (value: string): value is NintendoPlatform =>
  NINTENDO_PLATFORMS.some((platformValue: NintendoPlatform): boolean => platformValue === value);

export const isRecipeDifficulty = (value: string): value is RecipeDifficulty =>
  RECIPE_DIFFICULTIES.some(
    (difficultyValue: RecipeDifficulty): boolean => difficultyValue === value,
  );

export const isPetSpecies = (value: string): value is PetSpecies =>
  PET_SPECIES_OPTIONS.some((speciesValue: PetSpecies): boolean => speciesValue === value);

export const createItemId = (): string => {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  const randomChunk: number = Math.floor(Math.random() * 1_000_000_000);
  return `item-${Date.now()}-${randomChunk}`;
};

export const createEmptyDraft = (theme: Theme): ItemDraft => {
  switch (theme) {
    case 'products':
      return {
        kind: 'products',
        name: '',
        category: '',
        brand: '',
        price: '',
        inStock: true,
      };
    case 'movies':
      return {
        kind: 'movies',
        title: '',
        genre: '',
        director: '',
        year: '',
        watched: false,
      };
    case 'books':
      return {
        kind: 'books',
        title: '',
        author: '',
        publisher: '',
        pages: '',
        finished: false,
      };
    case 'nintendoGames':
      return {
        kind: 'nintendoGames',
        title: '',
        platform: 'Switch',
        genre: '',
        price: '',
        completed: false,
      };
    case 'veganRecipes':
      return {
        kind: 'veganRecipes',
        name: '',
        difficulty: 'easy',
        mainIngredient: '',
        minutes: '',
        favorite: false,
      };
    case 'events':
      return {
        kind: 'events',
        name: '',
        location: '',
        organizer: '',
        date: '',
        attended: false,
      };
    case 'trips':
      return {
        kind: 'trips',
        destination: '',
        country: '',
        season: '',
        days: '',
        planned: true,
      };
    case 'pets':
      return {
        kind: 'pets',
        name: '',
        species: 'dog',
        breed: '',
        age: '',
        vaccinated: false,
      };
  }
};

export const itemToDraft = (item: AppItem): ItemDraft => {
  switch (item.kind) {
    case 'products':
      return {
        kind: 'products',
        name: item.name,
        category: item.category,
        brand: item.brand,
        price: item.price.toString(),
        inStock: item.inStock,
      };
    case 'movies':
      return {
        kind: 'movies',
        title: item.title,
        genre: item.genre,
        director: item.director,
        year: item.year.toString(),
        watched: item.watched,
      };
    case 'books':
      return {
        kind: 'books',
        title: item.title,
        author: item.author,
        publisher: item.publisher,
        pages: item.pages.toString(),
        finished: item.finished,
      };
    case 'nintendoGames':
      return {
        kind: 'nintendoGames',
        title: item.title,
        platform: item.platform,
        genre: item.genre,
        price: item.price.toString(),
        completed: item.completed,
      };
    case 'veganRecipes':
      return {
        kind: 'veganRecipes',
        name: item.name,
        difficulty: item.difficulty,
        mainIngredient: item.mainIngredient,
        minutes: item.minutes.toString(),
        favorite: item.favorite,
      };
    case 'events':
      return {
        kind: 'events',
        name: item.name,
        location: item.location,
        organizer: item.organizer,
        date: item.date,
        attended: item.attended,
      };
    case 'trips':
      return {
        kind: 'trips',
        destination: item.destination,
        country: item.country,
        season: item.season,
        days: item.days.toString(),
        planned: item.planned,
      };
    case 'pets':
      return {
        kind: 'pets',
        name: item.name,
        species: item.species,
        breed: item.breed,
        age: item.age.toString(),
        vaccinated: item.vaccinated,
      };
  }
};

const buildError = (error: string): BuildItemResult => ({ ok: false, error });

const collectValidationErrors = (results: ReadonlyArray<ValidationResult<unknown>>): string[] =>
  results.flatMap((result: ValidationResult<unknown>): string[] =>
    result.ok ? [] : [result.error],
  );

export const buildItemFromDraft = (draft: ItemDraft, itemId?: string): BuildItemResult => {
  const id: string = itemId ?? createItemId();

  switch (draft.kind) {
    case 'products': {
      const name = readRequiredText(draft.name, 'El nombre');
      const category = readRequiredText(draft.category, 'La categoría');
      const brand = readRequiredText(draft.brand, 'La marca');
      const price = readNumberValue(draft.price, 'El precio', 0, false);
      if (!name.ok || !category.ok || !brand.ok || !price.ok) {
        return buildError(collectValidationErrors([name, category, brand, price]).join(' '));
      }

      return {
        ok: true,
        value: {
          id,
          kind: 'products',
          name: name.value,
          category: category.value,
          brand: brand.value,
          price: price.value,
          inStock: draft.inStock,
        },
      };
    }
    case 'movies': {
      const title = readRequiredText(draft.title, 'El título');
      const genre = readRequiredText(draft.genre, 'El género');
      const director = readRequiredText(draft.director, 'El director');
      const year = readNumberValue(draft.year, 'El año', 1888, true);
      if (!title.ok || !genre.ok || !director.ok || !year.ok) {
        return buildError(collectValidationErrors([title, genre, director, year]).join(' '));
      }

      return {
        ok: true,
        value: {
          id,
          kind: 'movies',
          title: title.value,
          genre: genre.value,
          director: director.value,
          year: year.value,
          watched: draft.watched,
        },
      };
    }
    case 'books': {
      const title = readRequiredText(draft.title, 'El título');
      const author = readRequiredText(draft.author, 'El autor');
      const publisher = readRequiredText(draft.publisher, 'La editorial');
      const pages = readNumberValue(draft.pages, 'Las páginas', 1, true);
      if (!title.ok || !author.ok || !publisher.ok || !pages.ok) {
        return buildError(collectValidationErrors([title, author, publisher, pages]).join(' '));
      }

      return {
        ok: true,
        value: {
          id,
          kind: 'books',
          title: title.value,
          author: author.value,
          publisher: publisher.value,
          pages: pages.value,
          finished: draft.finished,
        },
      };
    }
    case 'nintendoGames': {
      const title = readRequiredText(draft.title, 'El título');
      const genre = readRequiredText(draft.genre, 'El género');
      const price = readNumberValue(draft.price, 'El precio', 0, false);
      if (!title.ok || !genre.ok || !price.ok) {
        return buildError(collectValidationErrors([title, genre, price]).join(' '));
      }

      return {
        ok: true,
        value: {
          id,
          kind: 'nintendoGames',
          title: title.value,
          platform: draft.platform,
          genre: genre.value,
          price: price.value,
          completed: draft.completed,
        },
      };
    }
    case 'veganRecipes': {
      const name = readRequiredText(draft.name, 'El nombre');
      const mainIngredient = readRequiredText(draft.mainIngredient, 'El ingrediente principal');
      const minutes = readNumberValue(draft.minutes, 'Los minutos', 1, true);
      if (!name.ok || !mainIngredient.ok || !minutes.ok) {
        return buildError(collectValidationErrors([name, mainIngredient, minutes]).join(' '));
      }

      return {
        ok: true,
        value: {
          id,
          kind: 'veganRecipes',
          name: name.value,
          difficulty: draft.difficulty,
          mainIngredient: mainIngredient.value,
          minutes: minutes.value,
          favorite: draft.favorite,
        },
      };
    }
    case 'events': {
      const name = readRequiredText(draft.name, 'El nombre');
      const location = readRequiredText(draft.location, 'La ubicación');
      const organizer = readRequiredText(draft.organizer, 'El organizador');
      const date = readRequiredText(draft.date, 'La fecha');
      if (!name.ok || !location.ok || !organizer.ok || !date.ok) {
        return buildError(collectValidationErrors([name, location, organizer, date]).join(' '));
      }

      return {
        ok: true,
        value: {
          id,
          kind: 'events',
          name: name.value,
          location: location.value,
          organizer: organizer.value,
          date: date.value,
          attended: draft.attended,
        },
      };
    }
    case 'trips': {
      const destination = readRequiredText(draft.destination, 'El destino');
      const country = readRequiredText(draft.country, 'El país');
      const season = readRequiredText(draft.season, 'La temporada');
      const days = readNumberValue(draft.days, 'Los días', 1, true);
      if (!destination.ok || !country.ok || !season.ok || !days.ok) {
        return buildError(collectValidationErrors([destination, country, season, days]).join(' '));
      }

      return {
        ok: true,
        value: {
          id,
          kind: 'trips',
          destination: destination.value,
          country: country.value,
          season: season.value,
          days: days.value,
          planned: draft.planned,
        },
      };
    }
    case 'pets': {
      const name = readRequiredText(draft.name, 'El nombre');
      const breed = readRequiredText(draft.breed, 'La raza');
      const age = readNumberValue(draft.age, 'La edad', 0, true);
      if (!name.ok || !breed.ok || !age.ok) {
        return buildError(collectValidationErrors([name, breed, age]).join(' '));
      }

      return {
        ok: true,
        value: {
          id,
          kind: 'pets',
          name: name.value,
          species: draft.species,
          breed: breed.value,
          age: age.value,
          vaccinated: draft.vaccinated,
        },
      };
    }
  }
};

export const updateDraftTextField = (
  draft: ItemDraft,
  fieldName: string,
  fieldValue: string,
): ItemDraft => {
  switch (draft.kind) {
    case 'products':
      if (fieldName === 'name') {
        return { ...draft, name: fieldValue };
      }
      if (fieldName === 'category') {
        return { ...draft, category: fieldValue };
      }
      if (fieldName === 'brand') {
        return { ...draft, brand: fieldValue };
      }
      if (fieldName === 'price') {
        return { ...draft, price: fieldValue };
      }
      return draft;
    case 'movies':
      if (fieldName === 'title') {
        return { ...draft, title: fieldValue };
      }
      if (fieldName === 'genre') {
        return { ...draft, genre: fieldValue };
      }
      if (fieldName === 'director') {
        return { ...draft, director: fieldValue };
      }
      if (fieldName === 'year') {
        return { ...draft, year: fieldValue };
      }
      return draft;
    case 'books':
      if (fieldName === 'title') {
        return { ...draft, title: fieldValue };
      }
      if (fieldName === 'author') {
        return { ...draft, author: fieldValue };
      }
      if (fieldName === 'publisher') {
        return { ...draft, publisher: fieldValue };
      }
      if (fieldName === 'pages') {
        return { ...draft, pages: fieldValue };
      }
      return draft;
    case 'nintendoGames':
      if (fieldName === 'title') {
        return { ...draft, title: fieldValue };
      }
      if (fieldName === 'genre') {
        return { ...draft, genre: fieldValue };
      }
      if (fieldName === 'price') {
        return { ...draft, price: fieldValue };
      }
      if (fieldName === 'platform' && isNintendoPlatform(fieldValue)) {
        return { ...draft, platform: fieldValue };
      }
      return draft;
    case 'veganRecipes':
      if (fieldName === 'name') {
        return { ...draft, name: fieldValue };
      }
      if (fieldName === 'mainIngredient') {
        return { ...draft, mainIngredient: fieldValue };
      }
      if (fieldName === 'minutes') {
        return { ...draft, minutes: fieldValue };
      }
      if (fieldName === 'difficulty' && isRecipeDifficulty(fieldValue)) {
        return { ...draft, difficulty: fieldValue };
      }
      return draft;
    case 'events':
      if (fieldName === 'name') {
        return { ...draft, name: fieldValue };
      }
      if (fieldName === 'location') {
        return { ...draft, location: fieldValue };
      }
      if (fieldName === 'organizer') {
        return { ...draft, organizer: fieldValue };
      }
      if (fieldName === 'date') {
        return { ...draft, date: fieldValue };
      }
      return draft;
    case 'trips':
      if (fieldName === 'destination') {
        return { ...draft, destination: fieldValue };
      }
      if (fieldName === 'country') {
        return { ...draft, country: fieldValue };
      }
      if (fieldName === 'season') {
        return { ...draft, season: fieldValue };
      }
      if (fieldName === 'days') {
        return { ...draft, days: fieldValue };
      }
      return draft;
    case 'pets':
      if (fieldName === 'name') {
        return { ...draft, name: fieldValue };
      }
      if (fieldName === 'breed') {
        return { ...draft, breed: fieldValue };
      }
      if (fieldName === 'age') {
        return { ...draft, age: fieldValue };
      }
      if (fieldName === 'species' && isPetSpecies(fieldValue)) {
        return { ...draft, species: fieldValue };
      }
      return draft;
  }
};

export const updateDraftBooleanField = (
  draft: ItemDraft,
  fieldName: string,
  checked: boolean,
): ItemDraft => {
  switch (draft.kind) {
    case 'products':
      if (fieldName === 'inStock') {
        return { ...draft, inStock: checked };
      }
      return draft;
    case 'movies':
      if (fieldName === 'watched') {
        return { ...draft, watched: checked };
      }
      return draft;
    case 'books':
      if (fieldName === 'finished') {
        return { ...draft, finished: checked };
      }
      return draft;
    case 'nintendoGames':
      if (fieldName === 'completed') {
        return { ...draft, completed: checked };
      }
      return draft;
    case 'veganRecipes':
      if (fieldName === 'favorite') {
        return { ...draft, favorite: checked };
      }
      return draft;
    case 'events':
      if (fieldName === 'attended') {
        return { ...draft, attended: checked };
      }
      return draft;
    case 'trips':
      if (fieldName === 'planned') {
        return { ...draft, planned: checked };
      }
      return draft;
    case 'pets':
      if (fieldName === 'vaccinated') {
        return { ...draft, vaccinated: checked };
      }
      return draft;
  }
};

const isProductItem = (value: unknown): value is ProductItem => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    value.kind === 'products' &&
    hasString(value, 'id') &&
    hasString(value, 'name') &&
    hasString(value, 'category') &&
    hasString(value, 'brand') &&
    hasFiniteNumber(value, 'price') &&
    hasBoolean(value, 'inStock')
  );
};

const isMovieItem = (value: unknown): value is MovieItem => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    value.kind === 'movies' &&
    hasString(value, 'id') &&
    hasString(value, 'title') &&
    hasString(value, 'genre') &&
    hasString(value, 'director') &&
    hasFiniteNumber(value, 'year') &&
    hasBoolean(value, 'watched')
  );
};

const isBookItem = (value: unknown): value is BookItem => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    value.kind === 'books' &&
    hasString(value, 'id') &&
    hasString(value, 'title') &&
    hasString(value, 'author') &&
    hasString(value, 'publisher') &&
    hasFiniteNumber(value, 'pages') &&
    hasBoolean(value, 'finished')
  );
};

const isNintendoGameItem = (value: unknown): value is NintendoGameItem => {
  if (!isRecord(value)) {
    return false;
  }
  const platformValue: unknown = value.platform;
  if (typeof platformValue !== 'string') {
    return false;
  }
  return (
    value.kind === 'nintendoGames' &&
    hasString(value, 'id') &&
    hasString(value, 'title') &&
    isNintendoPlatform(platformValue) &&
    hasString(value, 'genre') &&
    hasFiniteNumber(value, 'price') &&
    hasBoolean(value, 'completed')
  );
};

const isVeganRecipeItem = (value: unknown): value is VeganRecipeItem => {
  if (!isRecord(value)) {
    return false;
  }
  const difficultyValue: unknown = value.difficulty;
  if (typeof difficultyValue !== 'string') {
    return false;
  }
  return (
    value.kind === 'veganRecipes' &&
    hasString(value, 'id') &&
    hasString(value, 'name') &&
    isRecipeDifficulty(difficultyValue) &&
    hasString(value, 'mainIngredient') &&
    hasFiniteNumber(value, 'minutes') &&
    hasBoolean(value, 'favorite')
  );
};

const isEventItem = (value: unknown): value is EventItem => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    value.kind === 'events' &&
    hasString(value, 'id') &&
    hasString(value, 'name') &&
    hasString(value, 'location') &&
    hasString(value, 'organizer') &&
    hasString(value, 'date') &&
    hasBoolean(value, 'attended')
  );
};

const isTripItem = (value: unknown): value is TripItem => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    value.kind === 'trips' &&
    hasString(value, 'id') &&
    hasString(value, 'destination') &&
    hasString(value, 'country') &&
    hasString(value, 'season') &&
    hasFiniteNumber(value, 'days') &&
    hasBoolean(value, 'planned')
  );
};

const isPetItem = (value: unknown): value is PetItem => {
  if (!isRecord(value)) {
    return false;
  }
  const speciesValue: unknown = value.species;
  if (typeof speciesValue !== 'string') {
    return false;
  }
  return (
    value.kind === 'pets' &&
    hasString(value, 'id') &&
    hasString(value, 'name') &&
    isPetSpecies(speciesValue) &&
    hasString(value, 'breed') &&
    hasFiniteNumber(value, 'age') &&
    hasBoolean(value, 'vaccinated')
  );
};

export const isAppItem = (value: unknown): value is AppItem => {
  if (!isRecord(value)) {
    return false;
  }
  if (value.kind === 'products') {
    return isProductItem(value);
  }
  if (value.kind === 'movies') {
    return isMovieItem(value);
  }
  if (value.kind === 'books') {
    return isBookItem(value);
  }
  if (value.kind === 'nintendoGames') {
    return isNintendoGameItem(value);
  }
  if (value.kind === 'veganRecipes') {
    return isVeganRecipeItem(value);
  }
  if (value.kind === 'events') {
    return isEventItem(value);
  }
  if (value.kind === 'trips') {
    return isTripItem(value);
  }
  if (value.kind === 'pets') {
    return isPetItem(value);
  }
  return false;
};
