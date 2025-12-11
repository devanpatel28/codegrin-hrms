import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { portfolioAPI, categoryAPI } from "@/utils/api";
import { ROUTES } from "@/constants/RoutesContants";
import { ICON_ASSETS } from "@/constants/IconConstant";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImagePreviewDialog from "@/components/ImagePreviewDialog";

export default function AdminPortfolio() {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [portfolioRes, categoryRes] = await Promise.all([
        portfolioAPI.getAll(),
        categoryAPI.getAll(),
      ]);

      setPortfolios(portfolioRes.data.portfolios || []);
      setCategories(categoryRes.data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get header image from images[]
  const getHeaderImage = (portfolio) => {
    const headerImg = portfolio.images?.find((img) => img.is_header === 1);
    return headerImg?.image_url || "/placeholder.webp";
  };

  // Filtering + Sorting
  const filteredPortfolios = useMemo(() => {
    let filtered = [...portfolios];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q) ||
          p.publisher_name?.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) =>
        p.categories?.some((cat) => cat.slug === selectedCategory)
      );
    }

    // Project Type
    if (selectedType !== "all") {
      filtered = filtered.filter((p) => p.project_type === selectedType);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [portfolios, searchQuery, selectedCategory, selectedType, sortBy]);

  const handleView = (portfolio) => {
    navigate(`${ROUTES.ADMIN.WEBSITE_MANAGE.PORTFOLIO}/${portfolio.id}`);
  };

  const handleAddNew = () => {
    navigate(ROUTES.ADMIN.WEBSITE_MANAGE.ADD_PORTFOLIO);
  };
   const handleCategory = () => {
    navigate(ROUTES.ADMIN.WEBSITE_MANAGE.CATEGORIES);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedType("all");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <ImagePreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        imageUrl={previewImage}
      />

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader className="border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white font-bold">
                Portfolio Management
              </CardTitle>
              <CardDescription className="text-slate-400">
                {filteredPortfolios.length} of {portfolios.length} projects
              </CardDescription>
            </div>

          <div className="flex gap-3">
              <Button
              variant="default"
              onClick={handleCategory}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Icon icon={ICON_ASSETS.CATEGORY} /> Manage Category
            </Button>
              <Button
              onClick={handleAddNew}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Icon icon={ICON_ASSETS.ADD}/> Add Portfolio
            </Button>
          </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mt-6">
            {/* Search */}
            <div className="relative w-full">
              <Icon
                icon={ICON_ASSETS.SEARCH}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white w-5 h-5"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-neutral-800 border-neutral-700 text-white pl-10"
              />
            </div>

            {/* Category */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white cursor-pointer">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                <SelectItem value="all" className="cursor-pointer">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug} className="cursor-pointer">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sorting */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white cursor-pointer">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                <SelectItem value="newest" className="cursor-pointer">Newest</SelectItem>
                <SelectItem value="oldest" className="cursor-pointer">Oldest</SelectItem>
                <SelectItem value="title-asc" className="cursor-pointer">Title A–Z</SelectItem>
                <SelectItem value="title-desc" className="cursor-pointer">Title Z–A</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset */}
            {(searchQuery ||
              selectedCategory !== "all" ||
              selectedType !== "all" ||
              sortBy !== "newest") && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-white hover:bg-neutral-800"
              >
                <Icon icon="mdi:filter-off" className="w-5 h-5" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                  <TableHead className="w-16 text-white">#</TableHead>
                  <TableHead className="w-24 text-white">Image</TableHead>
                  <TableHead className="min-w-[200px] text-white">Title</TableHead>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">Publisher</TableHead>
                  <TableHead className="w-32 text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredPortfolios.map((portfolio, index) => {
                  const headerImage = getHeaderImage(portfolio);

                  return (
                    <TableRow
                      key={portfolio.id}
                      className="border-neutral-800 hover:bg-neutral-800/50"
                    >
                      <TableCell className="text-white">{index + 1}</TableCell>

                      {/* Thumbnail Image */}
                      <TableCell>
                        <div
                          className="w-32 h-16 overflow-hidden rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center cursor-pointer"
                          onClick={() => {
                            const url = headerImage;

                            if (
                              url &&
                              typeof url === "string" &&
                              url.trim() !== "" &&
                              !url.includes("placeholder.webp")
                            ) {
                              setPreviewImage(url);
                              setPreviewOpen(true);
                            }
                          }}
                        >
                          {headerImage ? (
                            <img
                              src={headerImage}
                              alt={portfolio.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = "none";
                                e.target.parentNode.innerHTML = `
                              <div class='flex items-center justify-center w-full h-full'>
                                <svg class='w-8 h-8 text-neutral-500' fill='currentColor' viewBox='0 0 24 24'>
                                  <path d='M21 5v14H3V5h18m0-2H3c-1.1 0-2 .9-2 
                                  2v14c0 1.1.9 2 2 2h18c1.1 
                                  0 2-.9 2-2V5c0-1.1-.9-2-2-2m-4.5 
                                  9.5-2.25 3L12 12l-3.75 5H19l-2.5-3.5z'/>
                                </svg>
                              </div>
                            `;
                              }}
                            />
                          ) : (
                            <Icon
                              icon={ICON_ASSETS.BROKEN_IMAGE}
                              className="w-8 h-8 text-neutral-500"
                            />
                          )}
                        </div>
                      </TableCell>

                      {/* Title */}
                      <TableCell>
                        <div className="text-white font-medium">
                          {portfolio.title}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-1">
                          {portfolio.categories?.map((cat) => (
                            <Badge
                              key={cat.id}
                              className="bg-primary/20 text-primary-light text-xs border-0"
                            >
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        <Badge className="border-neutral-700 bg-neutral-800 text-white">
                          {portfolio.project_type || "N/A"}
                        </Badge>
                      </TableCell>

                      {/* Publisher */}
                      <TableCell className="text-white text-sm">
                        {portfolio.publisher_name || "-"}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Button
                          onClick={() => handleView(portfolio)}
                          className="w-full bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700"
                        >
                          <Icon
                            icon={ICON_ASSETS.EYE}
                            className="w-4 h-4 mr-2"
                          />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
