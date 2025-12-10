# Quick Start Guide

## Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_YANDEX_MAPS_KEY=your_yandex_maps_api_key
```

Get Yandex Maps API key: https://developer.tech.yandex.ru/services/

### 3. Start Development Server
```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── (auth)/login          # Login page
│   ├── (auth)/register       # Registration page
│   ├── (main)/page.tsx       # Main map view
│   └── (main)/dashboard      # Admin dashboard
├── shared/
│   ├── api/                  # API services
│   ├── components/           # React components
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities
│   └── types/                # TypeScript types
```

## Key Features

### For Citizens
- **Report Pollution**: Click map to add new pollution point
- **Upload Photos**: Document pollution with images
- **View Map**: See all reported pollution points
- **Filter**: Filter by status and type

### For Activists/Admins
- **Dashboard**: Manage all pollution reports
- **Update Status**: Mark points as in progress or cleaned
- **Export Reports**: Download CSV for analysis
- **Statistics**: View pollution analytics

## User Roles

1. **User** (Citizen)
   - Report pollution
   - View map

2. **Activist** (NGO)
   - All user features
   - Update status
   - Access dashboard
   - Export reports

3. **Admin** (Municipality)
   - All activist features
   - Delete points
   - Manage users

## Components Used

### shadcn/ui Components
- Button, Input, Label, Textarea
- Card, Badge
- Dialog, Sheet
- Select, Tabs
- Avatar, DropdownMenu
- Sonner (Toast notifications)

### Custom Components
- MapContainer (Yandex Maps)
- PollutionMarker
- ReportForm
- PointDetails
- FilterPanel
- StatsCard
- Header

## API Integration

The app expects a REST API with these endpoints:

**Authentication**
- POST `/auth/register`
- POST `/auth/login`
- GET `/auth/me`

**Pollution**
- GET `/pollution` (with filters)
- GET `/pollution/:id`
- POST `/pollution` (multipart/form-data)
- PATCH `/pollution/:id`
- DELETE `/pollution/:id`
- GET `/pollution/stats`
- GET `/pollution/export`

See `API_INTEGRATION.md` for detailed specs.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **State**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios with interceptors
- **Maps**: Yandex Maps
- **Auth**: JWT in cookies (js-cookie)

## Development Tips

### Adding New Components
```bash
npx shadcn@latest add [component-name]
```

### File Size Limit
Keep files under 100 lines. Split larger components.

### Styling
Use Tailwind utility classes only. No custom CSS.

### Type Safety
All components are fully typed. No `any` types.

## Common Tasks

### Add New Pollution Type
1. Update `PollutionType` enum in `src/shared/types/index.ts`
2. Add to `ReportForm.tsx` select options
3. Add icon in `PollutionMarker.tsx`

### Add New Filter
1. Update filter state in `page.tsx`
2. Add UI in `FilterPanel.tsx`
3. Pass to `usePollution` hook

### Customize Theme
Edit `src/app/globals.css` CSS variables

## Troubleshooting

### Map Not Loading
- Check `NEXT_PUBLIC_YANDEX_MAPS_KEY` in `.env.local`
- Verify API key is valid
- Check browser console for errors

### API Errors
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running
- Inspect Network tab in DevTools

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## Next Steps

1. **Connect Backend**: Update API URL when backend is ready
2. **Test Features**: Try all user flows
3. **Add Tests**: Write unit and E2E tests
4. **Deploy**: Deploy to Vercel or your hosting
5. **Monitor**: Add analytics and error tracking

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [Yandex Maps API](https://yandex.ru/dev/maps/)
- [Tailwind CSS](https://tailwindcss.com)

## Support

For issues or questions:
1. Check `ARCHITECTURE.md` for design decisions
2. Review `API_INTEGRATION.md` for API specs
3. Inspect browser console for errors
4. Check React Query DevTools (add if needed)

Happy coding! 🚀
