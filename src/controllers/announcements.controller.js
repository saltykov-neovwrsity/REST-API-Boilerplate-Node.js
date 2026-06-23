import prisma from '../../prisma/client.js'

export const getAnnouncements = async (req, res) => {
  const page = Number(req.query.page) || 1
  const perPage = 10
  const search = req.query.search
  const sort = req.query.sort

  const where = {}
  if (search) {
    const searchLower = search.toLowerCase()
    const searchUpper = search.toUpperCase()
    const searchCapitalized = search.charAt(0).toUpperCase() + search.slice(1).toLowerCase()

    where.OR = [
      { title: { contains: search } },
      { title: { contains: searchLower } },
      { title: { contains: searchUpper } },
      { title: { contains: searchCapitalized } },
    ]
  }

  const orderBy = {
    createdAt: sort === 'oldest' ? 'asc' : 'desc',
  }

  const [data, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.announcement.count({ where }),
  ])

  const totalPages = Math.ceil(total / perPage)

  res.json({
    data,
    pagination: {
      total,
      page,
      totalPages,
      perPage,
    },
  })
}

export const getAnnouncementById = async (req, res) => {
  const id = Number(req.params.id)
  const announcement = await prisma.announcement.findUniqueOrThrow({
    where: { id },
  })
  res.json(announcement)
}

export const createAnnouncement = async (req, res) => {
  const announcement = await prisma.announcement.create({
    data: req.body,
  })
  res.status(201).json(announcement)
}

export const updateAnnouncement = async (req, res) => {
  const id = Number(req.params.id)
  const announcement = await prisma.announcement.update({
    where: { id },
    data: req.body,
  })
  res.json(announcement)
}

export const deleteAnnouncement = async (req, res) => {
  const id = Number(req.params.id)
  await prisma.announcement.delete({
    where: { id },
  })
  res.status(204).end()
}
