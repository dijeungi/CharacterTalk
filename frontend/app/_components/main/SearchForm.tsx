// 'use client';

// import { useState } from 'react';
// import styles from './SearchForm.module.css';
// import { IoSearchOutline } from 'react-icons/io5';

// export default function SearchForm() {
//   const [query, setQuery] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim()) return;
//     window.location.href = `/?q=${encodeURIComponent(query)}`;
//   };

//   return (
//     <form className={styles.container} onSubmit={handleSubmit}>
//       <h2 className={styles.title}>캐릭터 검색</h2>
//       <label className={styles.label}>
//         <input
//           type="search"
//           name="q"
//           value={query}
//           onChange={e => setQuery(e.target.value)}
//           placeholder="캐릭터 검색 (앞에 @를 붙이면 크리에이터 검색)"
//           className={styles.input}
//         />
//         <button type="submit" className={styles.iconButton}>
//           <IoSearchOutline size={18} />
//         </button>
//       </label>
//     </form>
//   );
// }
